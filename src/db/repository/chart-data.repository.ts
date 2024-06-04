import { Injectable } from '@nestjs/common'
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm'

import { ChartDataModel } from '../model'

@Injectable()
export class ChartDataRepository extends Repository<ChartDataModel> {
  constructor(private dataSource: DataSource) {
    super(ChartDataModel, dataSource.createEntityManager())
  }

  protected getBaseQuery(): SelectQueryBuilder<ChartDataModel> {
    return this.createQueryBuilder('data')
  }
}
