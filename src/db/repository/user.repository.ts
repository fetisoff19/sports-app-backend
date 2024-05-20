import { Injectable } from '@nestjs/common';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';

import { UserModel } from '../model';

@Injectable()
export class UserRepository extends Repository<UserModel> {
  constructor(private dataSource: DataSource) {
    super(UserModel, dataSource.createEntityManager());
  }

  protected getBaseQuery(): SelectQueryBuilder<UserModel> {
    return this.createQueryBuilder('user');
  }

  async findByUuid(uuid: string): Promise<UserModel | null> {
    return this.getBaseQuery()
      .andWhere('user.uuid = :uuid', { uuid })
      .getOne();
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    return this.getBaseQuery()
      .andWhere('user.email = :email', { email: email.toLowerCase() })
      .getOne();
  }

  async findAll(): Promise<UserModel[]> {
    return (
      this.getBaseQuery()
        .leftJoinAndSelect('user.workouts', 'workout')
        .leftJoinAndSelect('workout.session', 'session')
        .select([
          'workout.uuid AS uuid',
          'workout.name AS name',
          'workout.sport AS sport',
          'workout.note AS note',
          'workout.date AS date',
          'workout.mapImage AS mapImage',
          'session.totalDistance AS distance',
          'session.totalElapsedTime AS time',
          'session.totalAscent AS elevation',
          'session.avgSpeed AS speed',
          'session.avgHeartRate AS hr',
          'session.avgPower AS power',
          'session.avgCadence AS cadence',
        ])
        .getRawMany()
    );
  }

  async existsByEmail(email: string): Promise<boolean> {
    return (
      1 ===
      (await this.getBaseQuery()
        .andWhere('user.email = :email', { email: email.toLowerCase() })
        .getCount())
    );
  }

  async updateOne(user: UserModel): Promise<UserModel> {
    user.updatedAt = new Date();
    return this.save(user);
  }

  async removeOne(user: UserModel): Promise<boolean> {
    await this.remove(user);
    return true;
  }
}
