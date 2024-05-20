import { sort, sortParams, sports } from '@common/constants'
import { WorkoutMainInfo } from '@common/types'
import { Injectable } from '@nestjs/common'
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm'

import { WorkoutModel } from '../model'

@Injectable()
export class WorkoutRepository extends Repository<WorkoutModel> {
  constructor(private dataSource: DataSource) {
    super(WorkoutModel, dataSource.createEntityManager())
  }

  protected getBaseQuery(): SelectQueryBuilder<WorkoutModel> {
    return this.createQueryBuilder('workout')
      .leftJoinAndSelect('workout.info', 'info')
      .leftJoinAndSelect('workout.session', 'session')
  }

  async findById(id: number | string): Promise<WorkoutModel | null> {
    return this.getBaseQuery()
      .andWhere('workout.id = :id', { id: Number(id) })
      .leftJoinAndSelect('workout.polyline', 'polyline')
      .leftJoinAndSelect('workout.chartData', 'chartData')
      .leftJoinAndSelect('workout.powerCurve', 'powerCurve')
      .getOne()
  }

  async findAllSports(userId: number | string): Promise<{ sport: string }[]> {
    return this.getBaseQuery()
      .andWhere('workout.userId = :userId', { userId: Number(userId) })
      .select('info.sport AS sport')
      .groupBy('info.sport')
      .getRawMany()
  }

  async getWorkoutsCount(userId: number | string) {
    return this.getBaseQuery()
      .andWhere('workout.userId = :userId', { userId: Number(userId) })
      .getCount()
  }
  async findByUserIdAndSha256(
    userId: number | string,
    sha256: string,
  ): Promise<WorkoutModel | null> {
    return this.getBaseQuery()
      .andWhere('workout.userId = :userId', { userId: Number(userId) })
      .andWhere('workout.sha256 = :sha256', { sha256 })
      .getOne()
  }

  async getWithPagination(
    userId: number | string,
    direction: (typeof sort)[number],
    limit: number,
    offset: number,
    param: (typeof sortParams)[number],
    sport: (typeof sports)[number],
  ): Promise<WorkoutMainInfo[]> {
    return this.getBaseQuery()
      .andWhere('workout.userId = :userId', { userId: Number(userId) })
      .andWhere(`info.sport = :sport OR ${!sport}`, { sport })
      .select([
        'workout.id AS id',
        'session.totalDistance AS distance',
        'session.totalElapsedTime AS time',
        'session.totalAscent AS elevation',
        'session.avgSpeed AS speed',
        'session.avgHeartRate AS hr',
        'session.avgPower AS power',
        'session.avgCadence AS cadence',
        'info.workoutName AS name',
        'info.sport AS sport',
        'info.note AS note',
        'info.date AS date',
        'info.mapImageLink AS map',
      ])
      .orderBy(param, direction)
      .limit(limit)
      .offset(offset)
      .getRawMany()
  }

  // async findAll(): Promise<WorkoutModel[]> {
  //   return this.getBaseQuery().getMany()
  // }
  //
  // async existsByEmail(email: string): Promise<boolean> {
  //   return (
  //     1 ===
  //     (await this.getBaseQuery()
  //       .andWhere('user.email = :email', { email: email.toLowerCase() })
  //       .getCount())
  //   )
  // }

  async updateOne(workout: WorkoutModel): Promise<WorkoutModel> {
    workout.updatedAt = new Date()
    return this.save(workout)
  }

  async removeOne(workout: WorkoutModel): Promise<boolean> {
    await this.remove(workout)
    return true
  }

  async removeAllByUserId(userId: number | string): Promise<boolean> {
    await this.getBaseQuery()
      .andWhere('workout.userId = :userId', { userId: Number(userId) })
      .delete()
      .execute()
    return true
  }
}
