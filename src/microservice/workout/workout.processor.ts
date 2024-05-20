import { OnQueueError, OnQueueStalled, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import * as _ from 'lodash';
import { WorkoutsService } from '@/microservice/workout/workout.service';

@Processor('workout')
export class WorkoutProcessor {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @OnQueueStalled()
  @OnQueueError()
  public async OnQueueError(job: Job): Promise<void> {
    try {
      await job.remove();
    } catch (e: unknown) {
      console.error(e);
    }
  }

  @Process('getWithPagination')
  async getWithPagination(job: Job) {
    try {
      const dto = _.get(job, 'data.dto');
      const uuid = _.get(job, 'data.user.uuid');
      return await this.workoutsService.getWithPagination(uuid, dto);
    } catch (e: unknown) {
      console.error(e);
    }
  }

  @Process('getOne')
  async findById(job: Job) {
    try {
      const dto = _.get(job, 'data.dto');
      const user = _.get(job, 'data.user');
      return await this.workoutsService.findByUuid(dto.uuid, user.uuid);
    } catch (e: unknown) {
      console.error(e);
    }
  }

  @Process('rename')
  async rename(job: Job) {
    try{
      const dto = _.get(job, 'data.dto');
      const user = _.get(job, 'data.user');
      return this.workoutsService.rename(dto, user.uuid);
    } catch (e: unknown) {
      console.error(e);
    }
  }

  @Process('remove')
  async removeOne(job: Job) {
    try {
      const dto = _.get(job, 'data.dto');
      const user = _.get(job, 'data.user');
      return this.workoutsService.removeOne(dto.uuid, user.uuid);
    } catch (e: unknown) {
      console.error(e);
    }
  }

  @Process('removeAll')
  async removeAll(job: Job) {
    try {
      const user = _.get(job, 'data.user');
      return this.workoutsService.removeAll(user.uuid);
    } catch (e: unknown) {
      console.error(e);
    }
  }
}
