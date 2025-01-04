import { Injectable } from '@nestjs/common'
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm'

import { PowerCurveModel } from '../model'
import { timePeriod } from '@/common/constants'

@Injectable()
export class PowerCurveRepository extends Repository<PowerCurveModel> {
  constructor(private dataSource: DataSource) {
    super(PowerCurveModel, dataSource.createEntityManager())
  }

  protected getBaseQuery(): SelectQueryBuilder<PowerCurveModel> {
    return this.createQueryBuilder('pc')
  }

  async findByWorkoutUuid(uuid: string): Promise<PowerCurveModel | null> {
    return this.getBaseQuery()
      .andWhere('pc.workout_uuid = :uuid', { uuid })
      .getOne()
  }

  async getForPeriod(
    start: string,
    end: string,
    user_uuid: string,
  ): Promise<Record<string, number>> {
    return this.getBaseQuery()
      .leftJoinAndSelect('pc.workout', 'workout')
      .andWhere('workout.user_uuid = :user_uuid', { user_uuid })
      .andWhere(`workout.date BETWEEN :start AND :end`, { start, end })
      .select([...timePeriod.map((p) => `MAX(pc.${p}) AS "${p}"`)])
      .getRawOne()
  }
}
