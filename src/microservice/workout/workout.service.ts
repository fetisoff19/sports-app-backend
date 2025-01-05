import { CryptoHelper, WorkoutParseHelper } from '@/common/helpers'
import { CustomError } from '@/custom-error'
import { SessionRepository, WorkoutRepository } from '@/db/repository'
import { Inject, Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { ChartsDataService } from '@/microservice/charts-data/charts-data.service'
import { PolylineService } from '@/microservice/polyline/polyline.service'
import { PowerCurveService } from '@/microservice/power-curve/power-curve.service'
import { PaginationDto } from '@/microservice/workout/dto'
import { WorkoutModel } from '@/db/model'
import StaticMaps from 'staticmaps'
import * as fs from 'node:fs'
import { ConfigService } from '@nestjs/config'
import { join } from 'path'
import { sports } from '@/common/constants'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'

@Injectable()
export class WorkoutsService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
    private readonly workoutRepository: WorkoutRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly chartDataService: ChartsDataService,
    private readonly polylineService: PolylineService,
    private readonly powerCurveService: PowerCurveService,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  public async getOneWithRelations(uuid: string, userUuid: string) {
    return this.workoutRepository.findOne({
      where: { uuid, user_uuid: userUuid },
      relations: {
        session: true,
        polyline: true,
        powerCurve: true,
        chartData: true,
      },
    })
  }

  public async findOne(uuid: string, userUuid: string) {
    return this.workoutRepository.findOne({
      where: { uuid, user_uuid: userUuid },
    })
  }

  public async getCountByUserUuid(uuid: string) {
    return await this.workoutRepository.getCountByUserUuid(uuid)
  }

  public async getWithPagination(userUuid: string, dto: PaginationDto) {
    const sport = !dto.sport || dto.sport === 'all' ? null : dto.sport
    return await this.workoutRepository.getWithPagination(
      userUuid,
      dto.direction,
      dto.limit,
      dto.offset,
      dto.param,
      sport,
      dto.name,
    )
  }

  public async getSportsDatesAndCount(userUuid: string, withDates = true) {
    if (withDates) {
      return this.workoutRepository.getSportsDatesAndCount(userUuid)
    }
    return this.workoutRepository.getSports(userUuid)
  }

  public async getTableStats(
    sport: (typeof sports)[number] | null,
    start: string,
    end: string,
    userUuid: string,
  ) {
    return this.workoutRepository.getTableStats(sport, start, end, userUuid)
  }

  public async getChartStats(
    sport: (typeof sports)[number] | null,
    start: string,
    end: string,
    userUuid: string,
  ) {
    return this.workoutRepository.getChartStats(sport, start, end, userUuid)
  }

  public async uploadFile(file: Express.Multer.File, user_uuid: string) {
    try {
      const sha256 = await CryptoHelper.hash256File(file)
      const duplicate = await this.workoutRepository.findByUserUuidAndSha256(
        user_uuid,
        sha256,
      )
      if (duplicate) {
        const duplicateName = duplicate?.file_name || ''
        throw new CustomError(
          400,
          `The ${file.originalname} file duplicates the workout ${duplicateName}`,
        )
      }

      const parseFit = await WorkoutParseHelper.parseFit(file)

      const { sessionData, info, records } =
        WorkoutParseHelper.getWorkoutData(parseFit)

      const polylinePoints = this.polylineService.getPoints(
        records,
        sessionData.smoothing,
      )
      const powerCurvePoints = this.powerCurveService.makePoints(records)
      const { chartPoints, mutatedSession } =
        this.chartDataService.makeChartsData(records, sessionData)

      const queryRunner = this.dataSource.createQueryRunner()
      await queryRunner.connect()
      await queryRunner.startTransaction()
      const newWorkout = this.workoutRepository.create({
        ...info,
        user_uuid,
        sha256,
        name: file.originalname.replace('.fit', ''),
      })
      let workout!: WorkoutModel
      try {
        let image!: string
        if (polylinePoints.length) {
          const coords: [number, number][] = polylinePoints.map((point) => [
            point[1],
            point[0],
          ])
          const options = {
            width: 300,
            height: 300,
            tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            tileSubdomains: ['a', 'b', 'c'],
          }
          const map = new StaticMaps(options)
          const polyline = {
            coords,
            color: 'rgb(0, 0, 0)',
            width: 3,
          }
          map.addLine(polyline)
          await fs.promises.mkdir(this.uploadDir(), { recursive: true })
          const mediaUuid = crypto.randomUUID()
          const dir = this.uploadDir()
          image = `${dir}/${mediaUuid}.png`
          newWorkout.map = `${mediaUuid}.png`
          await map.render()
          await map.image.save(image)
        }

        workout = await queryRunner.manager.save(newWorkout)
        const polyline = this.polylineService.create(
          polylinePoints,
          records.length,
          workout.uuid,
        )
        const chartData = this.chartDataService.create(
          chartPoints,
          records.length,
          workout.uuid,
        )
        const powerCurve = this.powerCurveService.create(
          powerCurvePoints,
          workout.uuid,
        )
        const session = this.sessionRepository.create({
          ...mutatedSession,
          workout_uuid: workout.uuid,
        })
        if (chartPoints) {
          await queryRunner.manager.save(chartData)
        }
        await queryRunner.manager.save(session)
        if (polylinePoints) {
          await queryRunner.manager.save(polyline)
        }
        if (powerCurvePoints) {
          await queryRunner.manager.save(powerCurve)
        }
        await queryRunner.commitTransaction()

        return this.workoutRepository.findByUuid(workout.uuid, user_uuid)
      } catch (e) {
        await queryRunner.rollbackTransaction()
        throw new Error(e)
      } finally {
        await queryRunner.release()
      }
    } catch (e) {
      throw new CustomError(422, `Error uploading file: ${e?.message || e}`)
    }
  }

  public async removeOne(workout: WorkoutModel) {
    const res = this.workoutRepository.removeOne(workout)
    if (workout.map) {
      this.removeMapImage(workout.map)
    }
    return res
  }

  public async save(workout: WorkoutModel) {
    return this.workoutRepository.updateOne(workout)
  }

  public async removeAll(uuid: string) {
    const mapImages = await this.workoutRepository.findAllMapImages(uuid)
    const result = await this.workoutRepository.removeAllByUserUuid(uuid)
    for (const { map } of mapImages) {
      this.removeMapImage(map)
    }
    return result
  }

  public async removeFromCache(pattern: string) {
    const keys = await this.cacheService.store.keys(pattern)
    for (const key of keys) {
      await this.cacheService.del(key)
    }
  }

  private removeMapImage(uuid: string) {
    if (uuid) {
      const path = join(this.uploadDir(), `${uuid}`)
      fs.unlink(path, () => {})
    }
  }

  private uploadDir() {
    return this.configService.get('upload.dir')
  }
}
