import { Injectable } from '@nestjs/common'
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm'

import { PolylineModel } from '../model'

@Injectable()
export class PolylineRepository extends Repository<PolylineModel> {
  constructor(private dataSource: DataSource) {
    super(PolylineModel, dataSource.createEntityManager())
  }

  protected getBaseQuery(): SelectQueryBuilder<PolylineModel> {
    return this.createQueryBuilder('polyline')
  }

  async findByWorkoutUuid(uuid: string): Promise<PolylineModel | null> {
    return this.getBaseQuery()
      .andWhere('polyline.workout_uuid = :uuid', { uuid })
      .getOne()
  }
}
