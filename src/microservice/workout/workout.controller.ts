import { DefaultDto } from '@/common/default-dto';
import { UserModel } from '@/db/model';

import { InjectQueue } from '@nestjs/bull';
import { Body, Controller, Delete, Get, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Queue } from 'bull';
import { User } from 'src/decorators';
import { WorkoutsService } from '@/microservice/workout/workout.service';
import { PaginationDto, RenameDto } from '@/microservice/workout/dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileTypeValidationPipe } from '@/pipes';
import { FileInterceptor } from '@nestjs/platform-express';
import { CustomError } from '@/custom-error';

@Controller('workout')
@ApiTags('workout')
export class WorkoutsController {
  constructor(
    @InjectQueue('workout') private readonly workoutQueue: Queue,
    private readonly workoutsService: WorkoutsService,
  ) {}

  @Get('one')
  async findByUuid(@Query() dto: DefaultDto, @User() user: UserModel) {
    try {
      const job = await this.workoutQueue.add('getOne', { dto, user });
      return await job.finished();
    } catch (e) {
      return new CustomError(404, `${e?.message || e}`)
    }
  }

  @Get()
  async getWithPagination(@Query() dto: PaginationDto, @User() user: UserModel,) {
    try{
      const job = await this.workoutQueue.add('getWithPagination', { dto, user });
      return await job.finished();
    } catch (e) {
      return new CustomError(404, `${e?.message || e}`)
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
    return  this.workoutsService.uploadFile(file, user.uuid);
  }

  @Patch()
  async rename( @Body() dto: RenameDto, @User() user: UserModel,){
    try {
      const job = await this.workoutQueue.add('rename', { dto, user });
      return await job.finished();
    } catch (e) {
      return new CustomError(404, `${e?.message || e}`)
    }
  }


  @Delete()
  async removeOne(@Body() dto: DefaultDto, @User() user: UserModel,) {
    try {
      const job = await this.workoutQueue.add('remove', { dto, user  });
      return await job.finished();
    } catch(e){
      return new CustomError(404, `${e?.message || e}`)
    }
  }

  @Delete('all')
  async removeAll(@User() user: UserModel) {
    try {
      const job = await this.workoutQueue.add('removeAll', { user });
      return await job.finished();
    } catch(e){
      return new CustomError(404, `${e?.message || e}`)
    }
  }

}
