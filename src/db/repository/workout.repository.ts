import { sort, sortParams, sports } from '@/common/constants'
import { ChartStats, MainStats, TableStats, WorkoutMainInfo } from '@/common/types'
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
  }

  async getCountByUserUuid(user_uuid: string): Promise<number> {
    return this.getBaseQuery()
      .andWhere('workout.user_uuid = :user_uuid', { user_uuid })
      .getCount()
  }

  async findByUuid(uuid: string, user_uuid: string): Promise<WorkoutMainInfo | null> {
    const query = this.getBaseQuery()
      .andWhere('workout.uuid = :uuid', { uuid })
      .andWhere('workout.user_uuid = :user_uuid', { user_uuid })
      .leftJoinAndSelect('workout.session', 'session')
    return query
      .select([
        'workout.uuid AS uuid',
        'session.total_distance AS distance',
        'session.total_elapsed_time AS time',
        'session.total_ascent AS elevation',
        'session.avg_speed AS speed',
        'session.enhanced_avg_speed AS enhanced_speed',
        'session.avg_heart_rate AS hr',
        'session.avg_power AS power',
        'session.avg_cadence AS cadence',
        'workout.name AS name',
        'workout.sport AS sport',
        'workout.note AS note',
        'workout.date AS date',
        'workout.map AS map',
      ])
      .getRawOne()
  }

  async getSportsDatesAndCount(user_uuid: string): Promise<MainStats[]> {
    return this.getBaseQuery()
      .andWhere('workout.user_uuid = :user_uuid', { user_uuid })
      .select([
        'workout.sport AS sport',
        'COUNT(*) as count',
        'MIN(workout.date) AS first',
        'MAX(workout.date) AS last',
      ])
      .groupBy('workout.sport')
      .orderBy('count', 'DESC')
      .getRawMany()
  }

  async getSports(user_uuid: string): Promise<Partial<Omit<MainStats, 'sport' | 'count'>>[]> {
    return this.getBaseQuery()
      .andWhere('workout.user_uuid = :user_uuid', { user_uuid })
      .select([
        'workout.sport AS sport',
        'COUNT(*) as count',
      ])
      .groupBy('workout.sport')
      .orderBy('count', 'DESC')
      .getRawMany()
  }

  async getTableStats(
    sport: (typeof sports)[number] | null,
    start: string,
    end: string,
    user_uuid: string,
  ): Promise<TableStats> {
   const query = this.getBaseQuery()
      .andWhere('workout.user_uuid = :user_uuid', { user_uuid })
      .andWhere(`workout.date BETWEEN :start AND :end`, { start, end })
      .leftJoinAndSelect('workout.session', 'session')
      .select([
        'COUNT(*) as count',

        'SUM(session.total_distance) AS total_distance',
        'SUM(session.total_elapsed_time) AS total_elapsed_time',
        'SUM(session.total_timer_time) AS total_timer_time',
        'SUM(session.total_ascent) AS total_ascent',
        'SUM(session.total_calories) AS total_calories',

        'AVG(NULLIF(session.total_distance, 0)) AS avg_distance',
        'AVG(NULLIF(session.total_elapsed_time, 0)) AS avg_elapsed_time',
        'AVG(NULLIF(session.total_timer_time, 0)) AS avg_timer_time',
        'AVG(NULLIF(session.avg_heart_rate, 0)) AS avg_heart_rate',
        'AVG(session.avg_speed) FILTER (WHERE session.cadence_coef = 1) AS avg_speed',
        'AVG(session.enhanced_avg_speed) FILTER (WHERE session.cadence_coef = 2) AS enhanced_avg_speed',
        'AVG(NULLIF(session.avg_cadence, 0)) AS avg_cadence',
        'AVG(NULLIF(session.avg_power, 0)) AS avg_power',
        'AVG(NULLIF(session.total_calories, 0)) AS avg_calories',

        'MAX(session.max_heart_rate) AS max_heart_rate',
      ])
    if(sport) {
      return query
        .andWhere(`workout.sport = :sport`, { sport })
        .getRawOne()
    }
    return query
      .getRawOne()
  }

  async getChartStats(
    sport: (typeof sports)[number] | null,
    start: string,
    end: string,
    user_uuid: string,
  ): Promise<ChartStats[]> {
    const query = this.getBaseQuery()
      .andWhere('workout.user_uuid = :user_uuid', { user_uuid })
      .andWhere(`workout.date BETWEEN :start AND :end`, { start, end })
      .leftJoinAndSelect('workout.session', 'session')
      .select([
        'workout.uuid AS uuid',
        'workout.name AS name',
        'workout.date AS date',
        'workout.sport AS sport',
        'session.total_distance AS total_distance',
        'session.total_elapsed_time AS total_elapsed_time',
        'session.total_timer_time AS total_timer_time',
        'session.total_ascent AS total_ascent',
        'session.total_calories AS total_calories',

        'session.avg_speed AS avg_speed',
        'session.enhanced_avg_speed AS enhanced_speed',
        'session.avg_heart_rate AS avg_heart_rate',
        'session.avg_cadence AS avg_cadence',
        'session.avg_power AS avg_power',

        'session.max_heart_rate AS max_heart_rate',
        'session.cadence_coef AS cadence_coef',

      ])
    if(sport) {
      return query
        .andWhere(`workout.sport = :sport`, { sport })
        .orderBy('date', 'ASC')
        .getRawMany()
    }
    return query
      .orderBy('date', 'ASC')
      .getRawMany()
  }

  async getWorkoutsCount(user_uuid: string) {
    return this.getBaseQuery()
      .andWhere('workout.user_uuid = :user_uuid', { user_uuid })
      .getCount()
  }

  async findByUserUuidAndSha256(
    user_uuid: string,
    sha256: string,
  ): Promise<WorkoutModel | null> {
    return this.getBaseQuery()
      .where('workout.user_uuid = :user_uuid', { user_uuid })
      .andWhere('workout.sha256 = :sha256', { sha256 })
      .getOne()
  }

  async getWithPagination(
    user_uuid: string,
    direction: (typeof sort)[number],
    limit: number,
    offset: number,
    param: (typeof sortParams)[number],
    sport: (typeof sports)[number],
    name?: string,
  ): Promise<WorkoutMainInfo[]> {
    const select = [
      'workout.uuid AS uuid',
      'session.total_distance AS distance',
      'session.total_timer_time AS time',
      'session.total_ascent AS elevation',
      'session.avg_speed AS speed',
      'session.enhanced_avg_speed AS enhanced_speed',
      'session.avg_heart_rate AS hr',
      'session.avg_power AS power',
      'session.avg_cadence AS cadence',
      'workout.name AS name',
      'workout.sport AS sport',
      'workout.note AS note',
      'workout.date AS date',
      'workout.map AS map',
    ]
    const query = this.getBaseQuery()
      .where('workout.user_uuid = :user_uuid', { user_uuid })
      .distinct(true)
      .leftJoinAndSelect('workout.session', 'session')
      .select(select)
      .orderBy(param, direction, direction === 'DESC' ? 'NULLS LAST' : 'NULLS FIRST')
      .limit(limit)
      .offset(offset)
    if(name?.length && sport){
      return query
        .andWhere(`workout.sport = :sport`, { sport })
        .andWhere(`workout.name ILIKE :name`, { name: `%${name}%` } )
        .getRawMany()
    }
    if(sport){
      return query
        .andWhere(`workout.sport = :sport`, { sport })
        .getRawMany()
    }
    if(name?.length){
      return query
        .andWhere(`workout.name ILIKE :name`, { name: `%${name}%` } )
        .getRawMany()
    }
    return query.getRawMany()
  }

  async findAllMapImages( user_uuid: string): Promise<{ map: string }[]> {
    return this.getBaseQuery()
      .andWhere('workout.user_uuid = :user_uuid', { user_uuid })
      .andWhere('workout.map IS NOT NULL')
      .select(['workout.map AS map'])
      .getRawMany()
  }

  async updateOne(workout: WorkoutModel): Promise<WorkoutModel> {
    workout.updated_at = new Date()
    return this.save(workout)
  }

  async removeOne(workout: WorkoutModel): Promise<boolean> {
    await this.remove(workout)
    return true
  }

  async removeAllByUserUuid(user_uuid: string): Promise<boolean> {
    await this.getBaseQuery()
      .andWhere('workout.user_uuid = :user_uuid', { user_uuid })
      .delete()
      .execute()
    return true
  }
}
