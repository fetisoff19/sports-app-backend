import { Injectable } from '@nestjs/common';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';

import { PowerCurveModel } from '../model';

@Injectable()
export class PowerCurveRepository extends Repository<PowerCurveModel> {
  constructor(private dataSource: DataSource) {
    super(PowerCurveModel, dataSource.createEntityManager());
  }

  protected getBaseQuery(): SelectQueryBuilder<PowerCurveModel> {
    return this.createQueryBuilder('pc');
  }

  async findByWorkoutUuid(uuid: string): Promise<PowerCurveModel | null> {
    return this.getBaseQuery()
      .andWhere('pc.workoutUuid = :uuid', { uuid })
      .getOne();
  }
}
