import { OnQueueError, OnQueueStalled, Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import * as _ from 'lodash'
import { WorkoutsService } from '@/microservice/workout/workout.service'

@Processor('workout')
export class WorkoutProcessor {
  constructor(private readonly workoutsService: WorkoutsService) {}

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
      const dto = _.get(job, 'data.dto')
      const uuid = _.get(job, 'data.user.uuid')
      const result = await this.workoutsService.getWithPagination(uuid, dto)
      if(!result){
        return
      }
      return result
    } catch (e: unknown) {
      console.error(e)
    }
  }

  @Process('one')
  async findById(job: Job) {
    try {
      const dto = _.get(job, 'data.dto')
      const user = _.get(job, 'data.user')
      const workout = await this.workoutsService.getOne(dto.uuid, user.uuid)
      if(!workout){
        return
      }
      return workout
    } catch (e: unknown) {
      console.error(e)
    }
  }

  @Process('rename')
  async rename(job: Job) {
    try{
      const dto = _.get(job, 'data.dto')
      const user = _.get(job, 'data.user')
      const workout = await this.workoutsService.findOne(dto.uuid, user.uuid)
      if(!workout){
        return
      }
      if(Object.hasOwn(dto, 'name') && dto.name.length ){
        workout.name = dto.name
        await this.workoutsService.save(workout)
      }
      if(Object.hasOwn(dto, 'note') ){
        workout.note = dto.note
        await this.workoutsService.save(workout)
      }
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
      if(!workout){
        return
      }
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
      if(!result){
        return
      }
      return result
    } catch (e: unknown) {
      console.error(e)
    }
  }
}
