import { CryptoHelper, WorkoutParseHelper } from '@/common/helpers';
import { CustomError } from '@/custom-error';
import {
  WorkoutRepository,
  SessionRepository,
} from '@/db/repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ChartsDataService } from '@/microservice/charts-data/charts-data.service';
import { PolylineService } from '@/microservice/polyline/polyline.service';
import { PowerCurveService } from '@/microservice/power-curve/power-curve.service';
import { PaginationDto, RenameDto } from '@/microservice/workout/dto';
import { WorkoutModel } from '@/db/model';
import * as StaticMaps from 'staticmaps';
import * as fs from 'node:fs';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Injectable()
export class WorkoutsService {
  constructor(
    private readonly workoutRepository: WorkoutRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly chartDataService: ChartsDataService,
    private readonly polylineService: PolylineService,
    private readonly powerCurveService: PowerCurveService,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,

  ) {}

  public async findByUuid(uuid: string, userUuid: string) {
    return await this.workoutRepository.findByUuid(uuid, userUuid);
  }

  public async getCountByUserUuid(uuid: string) {
    return await this.workoutRepository.getCountByUserUuid(uuid);
  }

  public async getWithPagination(userUuid: string, dto: PaginationDto) {
    const sport = !dto.sport || dto.sport === 'all' ? null : dto.sport;
    return await this.workoutRepository.getWithPagination(
      userUuid,
      dto.direction || 'DESC',
      dto.limit || 10,
      dto.offset || 0,
      dto.param || 'date',
      sport,
      dto.name
    );
  }
  public async findAllSports(userUuid: string) {
    return this.workoutRepository.findAllSports(userUuid);
  }

  public async getWorkoutsCount(userUuid: string) {
    return this.workoutRepository.getWorkoutsCount(userUuid);
  }

  public async uploadFile(file: any, userUuid: string) {
    try {
      const sha256 = await CryptoHelper.hash256File(file);
      const duplicate = await this.workoutRepository.findByUserUuidAndSha256(userUuid, sha256);
      if (duplicate) {
        const duplicateName = duplicate?.fileName || '';
        throw new CustomError(
          400,
          `The ${file.originalname} file duplicates the workout ${duplicateName}`,
        );
      }

      const parseFit = await WorkoutParseHelper.parseFit(file);

      const { sessionData, info, records, laps } =
        WorkoutParseHelper.getWorkoutData(parseFit);

      const polylinePoints = this.polylineService.getPoints(
        records,
        sessionData.smoothing,
      );
      const powerCurvePoints = this.powerCurveService.makePoints(records);
      const { chartPoints, mutatedSession } =
        this.chartDataService.makeChartsData(records, sessionData);

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const newWorkout = this.workoutRepository.create({
        ...info,
        userUuid,
        sha256,
        name: file.originalname.replace('.fit', ''),
      });
      let workout!: WorkoutModel;
      try {

        let image!: string;
        if(polylinePoints.length){
          const coords: [number, number][] = polylinePoints.map(point => [point[1], point[0]]);
          const options = {
            width: 300,
            height: 300,
            tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            tileSubdomains: ['a', 'b', 'c'],
          };
          const map = new StaticMaps(options);
          const polyline = {
            coords,
            color: 'rgb(0, 0, 0)',
            width: 3,
          };
          map.addLine(polyline);

          await fs.promises.mkdir(this.configService.get('upload.dir'), { recursive: true});
          const mediaUuid = crypto.randomUUID();
          image = `files/${mediaUuid}.png`;
          newWorkout.mapImage = `${mediaUuid}.png`;
          await map.render();
          await map.image.save(image);
        }

        workout = await queryRunner.manager.save(newWorkout);
        const polyline = this.polylineService.create(
          polylinePoints,
          records.length,
          workout.uuid,
        );
        const chartData = this.chartDataService.create(
          chartPoints,
          records.length,
          workout.uuid,
        );
        const powerCurve = this.powerCurveService.create(
          powerCurvePoints,
          workout.uuid,
        );
        const session = this.sessionRepository.create({
          ...mutatedSession,
          workoutUuid: workout.uuid,
        });

        chartPoints?.length && await queryRunner.manager.save(chartData);
        await queryRunner.manager.save(session);
        polylinePoints?.length && await queryRunner.manager.save(polyline);
        powerCurvePoints && await queryRunner.manager.save(powerCurve);
        await queryRunner.commitTransaction();

        return this.workoutRepository.findByUuid(workout.uuid, userUuid);
      } catch (e) {
        await queryRunner.rollbackTransaction();
        throw new Error(e);
      } finally {
        await queryRunner.release();
      }
      // обновить у юзера поля статистики, тренировок, чартсов, полилайнов и тд
    } catch (e) {
      throw new CustomError(
        422,
        `File ${file.originalname} not supported: ${e?.message || e}`,
      );
    }
  }

  public async removeOne(uuid: string, userUuid: string) {
    const workout = await this.workoutRepository.findOne({ where: { uuid,  userUuid }});
    if(!workout){
      throw new CustomError(404, 'Workout not found');
    }
    const res =  this.workoutRepository.removeOne(workout);
    if(workout.mapImage) {
      this.removeMapImage(workout.mapImage)
    }
    return res
  }

  public async rename(dto: RenameDto, userUuid: string) {
    const workout = await this.workoutRepository.findOne({ where: { uuid: dto.uuid,  userUuid }});
    if(!workout){
      throw new CustomError(404, 'Workout not found');
    }
    if(Object.hasOwn(dto, 'name') && dto.name.length ){
      workout.name = dto.name
      await this.workoutRepository.updateOne(workout)
    }
    if(Object.hasOwn(dto, 'note') ){
      workout.note = dto.note
      await this.workoutRepository.updateOne(workout)
    }
    return this.workoutRepository.findByUuid(dto.uuid, userUuid);
  }

  public async removeAll(uuid: string) {
    const mapImages = await this.workoutRepository.findAllMapImages(uuid)
    console.log(mapImages);
    for (const { map } of mapImages) {
      this.removeMapImage(map)
    }
    return this.workoutRepository.removeAllByUserUuid(uuid);
  }

  private removeMapImage(uuid: string) {
    if(!!uuid){
      const path = join(this.configService.get('upload.dir'), `${uuid}`)
      fs.unlink(path,() => {});
    }
  }

}
