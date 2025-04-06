import { OnQueueError, OnQueueStalled, Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import * as _ from 'lodash'
import { WorkoutsService } from '@/microservice/workout/workout.service'
import { WorkoutModel } from '@/db/model'
import { PaginationDto } from '@/microservice/workout/dto'
import { CacheService } from '@/microservice/cache/cache.service'

@Processor('workout')
export class WorkoutProcessor {
  constructor(
    private readonly cacheService: CacheService,
    private readonly workoutsService: WorkoutsService,
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

  @Process('some')
  async getWithPagination(job: Job) {
    try {
      const dto: PaginationDto = _.get(job, 'data.dto')
      const user = _.get(job, 'data.user')
      return this.workoutsService.getWithPagination(user.uuid, dto)
    } catch (e: unknown) {
      console.error(e)
    }
  }

  @Process('one')
  async findById(job: Job) {
    try {
      const dto = _.get(job, 'data.dto')
      const user = _.get(job, 'data.user')
      let workout = await this.cacheService.get<WorkoutModel | undefined>(
        `user:${user.uuid}.workout:${dto.uuid}`,
      )
      if (workout) {
        return workout
      }
      workout = await this.workoutsService.getOneWithRelations(
        dto.uuid,
        user.uuid,
      )
      if (!workout) {
        return
      }
      await this.cacheService.save(
        `user:${user.uuid}.workout:${workout.uuid}`,
        workout,
        3600 * 1000,
      )
      return workout
    } catch (e: unknown) {
      console.error(e)
    }
  }

  @Process('rename')
  async rename(job: Job) {
    try {
      const dto = _.get(job, 'data.dto')
      const user = _.get(job, 'data.user')
      const workout = await this.workoutsService.findOne(dto.uuid, user.uuid)
      if (!workout) {
        return
      }
      if (Object.hasOwn(dto, 'name') && dto.name.length) {
        workout.name = dto.name
        await this.workoutsService.save(workout)
      }
      if (Object.hasOwn(dto, 'note')) {
        workout.note = dto.note
        await this.workoutsService.save(workout)
      }
      await this.cacheService.remove(`user:${user.uuid}.workout:${workout.uuid}`)

      return this.workoutsService.findOne(dto.uuid, user.uuid)
    } catch (e: unknown) {
      console.error(e)
    }
  }

  @Process('remove')
  async removeOne(job: Job) {
    try {
      const dto = _.get(job, 'data.dto')
      const user = _.get(job, 'data.user')
      const workout = await this.workoutsService.findOne(dto.uuid, user.uuid)
      if (!workout) {
        return
      }
      await this.cacheService.remove(`user:${user.uuid}.workout:${workout.uuid}`)
      return this.workoutsService.removeOne(workout)
    } catch (e: unknown) {
      console.error(e)
    }
  }

  @Process('remove-all')
  async removeAll(job: Job) {
    try {
      const user = _.get(job, 'data.user')
      const result = await this.workoutsService.removeAll(user.uuid)
      if (!result) {
        return
      }
      await this.workoutsService.removeFromCache(`user:${user.uuid}*`)
      return result
    } catch (e: unknown) {
      console.error(e)
    }
  }
}
