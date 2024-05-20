import { sort, sortParams, sports } from '@/common/constants';
import { WorkoutMainInfo } from '@/common/types';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';

import { WorkoutModel } from '../model';

@Injectable()
export class WorkoutRepository extends Repository<WorkoutModel> {
  constructor(private dataSource: DataSource) {
    super(WorkoutModel, dataSource.createEntityManager());
  }

  protected getBaseQuery(): SelectQueryBuilder<WorkoutModel> {
    return this.createQueryBuilder('workout')
  }

  async getCountByUserUuid(uuid: string): Promise<number> {
    return this.getBaseQuery()
      .andWhere('workout.userUuid = :uuid', { uuid })
      .getCount()
  }

  async findByUuid(uuid: string, userUuid: string): Promise<WorkoutMainInfo | null> {
    const query = this.getBaseQuery()
      .andWhere('workout.uuid = :uuid', { uuid })
      .andWhere('workout.userUuid = :userUuid', { userUuid })
      .leftJoinAndSelect('workout.session', 'session');
    return query
      .select([
      'workout.uuid AS uuid',
      'session.totalDistance AS distance',
      'session.totalElapsedTime AS time',
      'session.totalAscent AS elevation',
      'session.avgSpeed AS speed',
      'session.avgHeartRate AS hr',
      'session.avgPower AS power',
      'session.avgCadence AS cadence',
      'workout.name AS name',
      'workout.sport AS sport',
      'workout.note AS note',
      'workout.date AS date',
      'workout.mapImage AS map',
    ]).getRawOne()
  }

  async findAllSports(userUuid: string): Promise<{ sport: string }[]> {
    return this.getBaseQuery()
      .andWhere('workout.userUuid = :userUuid', { userUuid })
      .select('info.sport AS sport')
      .groupBy('info.sport')
      .getRawMany();
  }

  async getWorkoutsCount(userUuid: string) {
    return this.getBaseQuery()
      .andWhere('workout.userUuid = :userUuid', { userUuid })
      .getCount();
  }
  async findByUserUuidAndSha256(
    uuid: string,
    sha256: string,
  ): Promise<WorkoutModel | null> {
    return this.getBaseQuery()
      .where('workout.userUuid = :uuid', { uuid })
      .andWhere('workout.sha256 = :sha256', { sha256 })
      .getOne();
  }

  async getWithPagination(
    userUuid: string,
    direction: (typeof sort)[number],
    limit: number,
    offset: number,
    param: (typeof sortParams)[number],
    sport: (typeof sports)[number],
    name?: string
  ): Promise<WorkoutMainInfo[]> {
    return this.getBaseQuery()
      .andWhere('workout.userUuid = :userUuid', { userUuid })
      .andWhere(`workout.sport = :sport OR ${!sport}`, { sport })
      .andWhere(`workout.name LIKE :name`, {name: `%${name}%`})
      .leftJoinAndSelect('workout.session', 'session')
      .select([
        'workout.uuid AS uuid',
        'session.totalDistance AS distance',
        'session.totalElapsedTime AS time',
        'session.totalAscent AS elevation',
        'session.avgSpeed AS speed',
        'session.avgHeartRate AS hr',
        'session.avgPower AS power',
        'session.avgCadence AS cadence',
        'workout.name AS name',
        'workout.sport AS sport',
        'workout.note AS note',
        'workout.date AS date',
        'workout.mapImage AS map',
      ])
      .orderBy(param, direction)
      .limit(limit)
      .offset(offset)
      .getRawMany();
  }

  async findAllMapImages( userUuid: string,): Promise<{ map: string }[]> {
    return this.getBaseQuery()
      .andWhere('workout.userUuid = :userUuid', { userUuid })
      .andWhere('workout.mapImage IS NOT NULL')
      .select(['workout.mapImage AS map'])
      .getRawMany();
  }

  async existsByEmail(email: string): Promise<boolean> {
    return (
      1 ===
      (await this.getBaseQuery()
        .andWhere('user.email = :email', { email: email.toLowerCase() })
        .getCount())
    )
  }

  async updateOne(workout: WorkoutModel): Promise<WorkoutModel> {
    workout.updatedAt = new Date();
    return this.save(workout);
  }

  async removeOne(workout: WorkoutModel): Promise<boolean> {
    await this.remove(workout);
    return true;
  }

  async removeAllByUserUuid(userUuid: string): Promise<boolean> {
    await this.getBaseQuery()
      .andWhere('workout.user_uuid = :userUuid', { userUuid })
      .delete()
      .execute();
    return true;
  }
}
