import { timePeriod } from '@/common/constants';
import { getMaxValueForArrayPeriods } from '@/common/helpers';
import { WorkoutRecord as WorkoutRecord } from '@/common/types';
import { PowerCurveRepository } from '@/db/repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PowerCurveService {
  constructor(private readonly powerCurveRepository: PowerCurveRepository) {}

  makePoints(records: WorkoutRecord[]) {
    if (records.length) {
      return getMaxValueForArrayPeriods(records, 'power', timePeriod);
    }
    return null;
  }

  create(points: Record<string, number>, workoutUuid: string) {
    return this.powerCurveRepository.create({
      ...points,
      workoutUuid,
    });
  }

  async findByWorkoutUuid(uuid: string) {
    return this.powerCurveRepository.findByWorkoutUuid(uuid);
  }
}
