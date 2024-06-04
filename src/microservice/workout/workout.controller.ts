import { DefaultDto } from 'src/common/dto'
import { UserModel } from '@/db/model'

import { InjectQueue } from '@nestjs/bull'
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Queue } from 'bull'
import { User } from 'src/decorators'
import { WorkoutsService } from '@/microservice/workout/workout.service'
import { PaginationDto, RenameDto } from '@/microservice/workout/dto'
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { FileTypeValidationPipe } from '@/pipes'
import { FileInterceptor } from '@nestjs/platform-express'
import { CustomError } from '@/custom-error'
import * as _ from 'lodash';
import { Response } from 'express';

@Controller('workout')
@ApiTags('workout')
export class WorkoutsController {
  constructor(
    @InjectQueue('workout') private readonly workoutQueue: Queue,
    private readonly workoutsService: WorkoutsService,
  ) {}

  @Get('one')
  async getOne(@Query() dto: DefaultDto, @User() user: UserModel, @Res() res: Response) {
    try {
      const job = await this.workoutQueue.add('one', { dto, user })
      const result = await job.finished();
      if (!result) {
        throw new CustomError(404, 'Workout not found')
      }
      return res.status(200)
        .header('Content-Type', 'application/json')
        .send(result);
    } catch (e) {
      return res
        .status(_.get(e, 'status', 500))
        .header('Content-Type', 'application/json')
        .send({ message: _.get(e, 'message', 'Internal server error') });
    }
  }

  @Get()
  async getWithPagination(@Query() dto: PaginationDto, @User() user: UserModel, @Res() res: Response) {
    try{
      const job = await this.workoutQueue.add('some', { dto, user })
      const result = await job.finished();
      if (!result) {
        throw new CustomError(404, 'Workouts not found')
      }
      return res.status(200)
        .header('Content-Type', 'application/json')
        .send(result);
    } catch (e: unknown) {
      return res
        .status(_.get(e, 'status', 500))
        .header('Content-Type', 'application/json')
        .send({ message: _.get(e, 'message', 'Internal server error') })
    }
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'file',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(
    @UploadedFile(new FileTypeValidationPipe(['fit'], 5)) file: Express.Multer.File, @User() user: UserModel ) {
    return this.workoutsService.uploadFile(file, user.uuid)
  }

  @Patch()
  async rename( @Body() dto: RenameDto, @User() user: UserModel, @Res() res: Response){
    try {
      const job = await this.workoutQueue.add('rename', { dto, user })
      const result = await job.finished();
      if (!result) {
        throw new CustomError(404, 'Workout not found')
      }
      return res.status(200)
        .header('Content-Type', 'application/json')
        .send(result);
    } catch (e: unknown) {
      return res
        .status(_.get(e, 'status', 500))
        .header('Content-Type', 'application/json')
        .send({ message: _.get(e, 'message', 'Internal server error') });
    }
  }


  @Delete()
  async removeOne(@Body() dto: DefaultDto, @User() user: UserModel, @Res() res: Response) {
    try {
      const job = await this.workoutQueue.add('remove', { dto, user  })
      const result = await job.finished();
      if (!result) {
        throw new CustomError(404, 'Workout not found')
      }
      return res.status(200)
        .header('Content-Type', 'application/json')
        .send(result);
    } catch(e: unknown){
      return res
        .status(_.get(e, 'status', 500))
        .header('Content-Type', 'application/json')
        .send({ message: _.get(e, 'message', 'Internal server error') });
    }
  }

  @Delete('all')
  async removeAll(@User() user: UserModel, @Res() res: Response) {
    try {
      const job = await this.workoutQueue.add('remove-all', { user })
      const result = await job.finished();
      if (!result) {
        throw new CustomError(404, 'Workout not found')
      }
      return res.status(200)
        .header('Content-Type', 'application/json')
        .send(result);
    } catch(e: unknown){
      return res
        .status(_.get(e, 'status', 500))
        .header('Content-Type', 'application/json')
        .send({ message: _.get(e, 'message', 'Internal server error') });
    }
  }

}
