import { timePeriod } from '@common/constants'
import { getMaxValueForArrayPeriods } from '@common/helpers'
import { Record } from '@common/types'
import { PowerCurveRepository } from '@db/repository'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PowerCurveService {
  constructor(private readonly powerCurveRepository: PowerCurveRepository) {}

  makePoints(records: Record[]) {
    if (records.length) {
      return getMaxValueForArrayPeriods(records, 'power', timePeriod)
    }
    return null
  }

  create(points: object, workoutId: number) {
    console.log(points)
    return this.powerCurveRepository.create({
      ...points,
      workoutId,
    })
  }

  async findByWorkoutId(id: number | string) {
    return this.powerCurveRepository.findByWorkoutId(id)
  }
}
