import { OnQueueError, OnQueueStalled, Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import * as _ from 'lodash'
import { WorkoutsService } from '@/microservice/workout/workout.service'
import { PowerCurveService } from '@/microservice/power-curve/power-curve.service'

@Processor('stats')
export class StatsProcessor {
  constructor(
    private readonly workoutsService: WorkoutsService,
    private readonly powerCurveService: PowerCurveService,
  ) {}

  @OnQueueStalled()
  @OnQueueError()
  public async OnQueueError(job: Job): Promise<void> {
    try {
      await job.remove()
    } catch (e: unknown) {
      console.error(e)
    }
  }

  @Process('main')
  async getMainStats(job: Job) {
    try {
      const dto = _.get(job, 'data.dto')
      const user = _.get(job, 'data.user')
      const result = await this.workoutsService.getSportsDatesAndCount(
        user.uuid,
        dto.withDates,
      )
      if (!result) {
        return
      }
      return result
    } catch (e: unknown) {
      console.error(e)
    }
  }

  @Process('table')
  async getTableStats(job: Job) {
    try {
      const dto = _.get(job, 'data.dto')
      const user = _.get(job, 'data.user')
      const result = await this.workoutsService.getTableStats(
        dto.sport,
        dto.start,
        dto.end,
        user.uuid,
      )
      if (!result) {
        return
      }
      return result
    } catch (e: unknown) {
      console.error(e)
    }
  }

  @Process('chart')
  async getChartStats(job: Job) {
    try {
      const dto = _.get(job, 'data.dto')
      const user = _.get(job, 'data.user')
      const workouts = await this.workoutsService.getChartStats(
        dto.sport,
        dto.start,
        dto.end,
        user.uuid,
      )
      if (!workouts) {
        return
      }
      return { workouts, start: dto.start, end: dto.end }
    } catch (e: unknown) {
      console.error(e)
    }
  }

  @Process('power-curve')
  async getPowerCurve(job: Job) {
    try {
      const dto = _.get(job, 'data.dto')
      const user = _.get(job, 'data.user')
      const powerCurve = await this.powerCurveService.getForPeriod(
        dto.start,
        dto.end,
        user.uuid,
      )
      if (!powerCurve) {
        return
      }
      return { powerCurve, start: dto.start, end: dto.end }
    } catch (e: unknown) {
      console.error(e)
    }
  }
}
