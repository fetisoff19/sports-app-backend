import { Injectable } from '@nestjs/common';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';

import { PolylineModel } from '../model';

@Injectable()
export class PolylineRepository extends Repository<PolylineModel> {
  constructor(private dataSource: DataSource) {
    super(PolylineModel, dataSource.createEntityManager());
  }

  protected getBaseQuery(): SelectQueryBuilder<PolylineModel> {
    return this.createQueryBuilder('polyline');
  }

  async findByWorkoutUuid(uuid: string): Promise<PolylineModel | null> {
    return this.getBaseQuery()
      .andWhere('polyline.workoutUuid = :uuid', { uuid })
      .getOne();
  }
  //
  // async findByUserIdAndSha256(
  //   userId: number | string,
  //   sha256: string,
  // ): Promise<WorkoutModel | null> {
  //   return this.getBaseQuery()
  //     .andWhere('workout.userId = :userId', { userId: Number(userId) })
  //     .andWhere('workout.sha256 = :sha256', { sha256 })
  //     .getOne()
  // }
  //
  // async findByUserId(userId: number | string): Promise<WorkoutModel[]> {
  //   return this.getBaseQuery()
  //     .andWhere('workout.userId = :userId', { userId: Number(userId) })
  //     .getMany()
  // }

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

  // async updateOne(workout: WorkoutModel): Promise<WorkoutModel> {
  //   workout.updatedAt = new Date()
  //   return this.save(workout)
  // }
  //
  // async removeOne(workout: WorkoutModel): Promise<boolean> {
  //   await this.remove(workout)
  //   return true
  // }
  //
  // async removeAllByUserId(userId: number | string): Promise<boolean> {
  //   await this.getBaseQuery()
  //     .andWhere('workout.userId = :userId', { userId: Number(userId) })
  //     .delete()
  //     .execute()
  //   return true
  // }
}
