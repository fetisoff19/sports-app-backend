import { CustomError } from '@custom-error'
import { WorkoutsService } from '@modules/workout/workout.service'
import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueError,
  OnQueueFailed,
  OnQueueStalled,
  Process,
  Processor,
} from '@nestjs/bull'
import { Job } from 'bull'
import * as _ from 'lodash'

@Processor('workout')
export class WorkoutProcessor {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @OnQueueStalled()
  @OnQueueError()
  public async OnQueueError(job: Job): Promise<void> {
    try {
      console.error('stalled', job.id)
      // throw new CustomError(500, `stalled ${job.id}`)
      await job.remove()
    } catch (e: unknown) {
      console.error(e)
    }
  }

  // @OnQueueActive()
  // public async onActive(job: Job): Promise<void> {
  //   console.log(
  //     `Processing job ${job.id} of type ${job.data.user.email} with data ${job.data.user.email} ${Object.keys(
  //       job.data.dto,
  //     )
  //       .map((key) => `${key}=${job.data.dto[key]}`)
  //       .join('&')}...`,
  //   )
  // }
  // @OnQueueCompleted()
  // public async onCompleted(job: Job): Promise<void> {
  //   console.log(
  //     `Job ${job.id} of type ${job.name} with data ${job.data.user.email} ${Object.keys(
  //       job.data.dto,
  //     )
  //       .map((key) => `${key}=${job.data.dto[key]}`)
  //       .join('&')} was completed`,
  //   )
  // }
  // @OnGlobalQueueCompleted()
  // async onGlobalCompleted(jobId: number, result: any) {
  //   const job = await this.immediateQueue.getJob(jobId)
  //   console.log('(Global) on completed: job ', job.id, ' -> result: ', result)
  // }
  @Process('getWithPagination')
  async getWithPagination(job: Job) {
    const dto = _.get(job, 'data.dto')
    const userId = _.get(job, 'data.user.id')
    const result = await this.workoutsService.getWithPagination(userId, dto)
    // const delay = async (ms) =>
    //   await new Promise((resolve) => setTimeout(resolve, ms))
    // return delay(5000).then(() => result)
    return result
  }

  @Process('upload')
  async upload(job: Job) {
    const file = _.get(job, 'data.file')
    const userId = _.get(job, 'data.user.id')
    const size = file.size / 1024
    console.time(file.originalname + ' - ' + size)
    const res = await this.workoutsService.uploadFile(file, userId || 1)
    console.timeEnd(file.originalname + ' - ' + size)
    return res
  }

  @Process('getOne')
  async findById(job: Job) {
    const id = _.get(job, 'data.id')
    const res = await this.workoutsService.findById(id)
    return res
  }
}
