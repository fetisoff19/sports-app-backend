import { timePeriod } from '@/common/constants'
import { getMaxValueForArrayPeriods } from '@/common/helpers'
import { WorkoutRecord as WorkoutRecord } from '@/common/types'
import { PowerCurveRepository } from '@/db/repository'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PowerCurveService {
  constructor(private readonly powerCurveRepository: PowerCurveRepository) {}

  public makePoints(records: WorkoutRecord[]) {
    if (records.length) {
      return getMaxValueForArrayPeriods(records, 'power', timePeriod)
    }
    return null
  }

  public create(points: Record<string, number>, workoutUuid: string) {
    return this.powerCurveRepository.create({
      ...points,
      workout_uuid: workoutUuid,
    })
  }

  public async getForPeriod(start: string, end: string, user_uuid: string) {
    return this.powerCurveRepository.getForPeriod(start, end, user_uuid)
  }

}
