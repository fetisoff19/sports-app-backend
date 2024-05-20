import { CryptoHelper, WorkoutParseHelper } from '@common/helpers'
import { CustomError } from '@custom-error'
import {
  WorkoutInfoRepository,
  WorkoutRepository,
  WorkoutSessionRepository,
} from '@db/repository'
import { ChartsDataService } from '@modules/charts-data/charts-data.service'
import { PolylineService } from '@modules/polyline/polyline.service'
import { PowerCurveService } from '@modules/power-curve/power-curve.service'
import { PaginationDto } from '@modules/workout/dto'
import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'

@Injectable()
export class WorkoutsService {
  constructor(
    private readonly workoutRepository: WorkoutRepository,
    private readonly workoutInfoRepository: WorkoutInfoRepository,
    private readonly workoutSessionRepository: WorkoutSessionRepository,
    private readonly chartDataService: ChartsDataService,
    private readonly polylineService: PolylineService,
    private readonly powerCurveService: PowerCurveService,
    private readonly dataSource: DataSource,
  ) {}

  async findById(id: number | string) {
    return await this.workoutRepository.findById(id)
  }

  async getWithPagination(userId: number | string, dto: PaginationDto) {
    const sport = !dto.sport || dto.sport === 'all' ? null : dto.sport
    return await this.workoutRepository.getWithPagination(
      userId,
      dto.direction || 'DESC',
      dto.limit || 10,
      dto.offset || 0,
      dto.param || 'date',
      sport,
    )
  }

  async findAllSports(userId: number | string) {
    return this.workoutRepository.findAllSports(userId)
  }

  async getWorkoutsCount(userId: number | string) {
    return this.workoutRepository.getWorkoutsCount(userId)
  }

  async uploadFile(file: Express.Multer.File, userId: number) {
    try {
      const sha256 = await CryptoHelper.hash256File(file)
      const duplicate = await this.validate(userId, sha256)
      if (duplicate) {
        const duplicateName = duplicate?.info?.workoutName || ''
        throw new CustomError(
          400,
          `The ${file.originalname} file duplicates the workout ${duplicateName}`,
        )
      }
      const parseFit = await WorkoutParseHelper.parseFit(file)

      const { sessionData, info, records, laps } =
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
        userId,
        sha256,
      })
      let workout = null
      try {
        workout = await queryRunner.manager.save(newWorkout)
        const newInfo = this.workoutInfoRepository.create({
          ...info,
          workoutId: workout.id,
        })

        const polyline = this.polylineService.create(
          polylinePoints,
          records.length,
          workout.id,
        )
        const chartData = this.chartDataService.create(
          chartPoints,
          records.length,
          workout.id,
        )
        const powerCurve = this.powerCurveService.create(
          powerCurvePoints,
          workout.id,
        )
        const session = this.workoutSessionRepository.create({
          ...mutatedSession,
          workoutId: workout.id,
        })

        await queryRunner.manager.save(chartData)
        await queryRunner.manager.save(newInfo)
        await queryRunner.manager.save(session)
        await queryRunner.manager.save(polyline)
        await queryRunner.manager.save(powerCurve)
        await queryRunner.commitTransaction()

        return this.workoutRepository.findById(workout.id)
      } catch (e) {
        await queryRunner.rollbackTransaction()
        throw new Error(e)
      } finally {
        await queryRunner.release()
      }
      // обновить у юзера поля статистики, тренировок, чартсов, полилайнов и тд
    } catch (e) {
      throw new CustomError(
        422,
        `File ${file.originalname} not supported: ${e?.message || e}`,
      )
    }
  }

  async removeOne(id: number, userId: number | string) {
    const workout = await this.workoutRepository.findById(id)
    if (workout) {
      return this.workoutRepository.removeOne(workout)
    }
    // поправить статистику у юзера
    throw new CustomError(404, 'Workout not found')
  }

  async deleteAllWorkouts(userId: number | string) {
    return this.workoutRepository.removeAllByUserId(userId)
  }

  private async validate(userId: number | string, sha256: string) {
    return this.workoutRepository.findByUserIdAndSha256(userId, sha256)
  }
}
