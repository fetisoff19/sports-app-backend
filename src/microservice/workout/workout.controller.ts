import { DefaultBodyDto, DefaultParamsDto } from '@common/default-dto'
import { UserModel } from '@db/model'
import { PaginationDto } from '@modules/workout/dto'
import { WorkoutsService } from '@modules/workout/workout.service'
import { InjectQueue } from '@nestjs/bull'
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger'
import { FileTypeValidationPipe } from '@pipes/file-validation.pipe'
import { Queue } from 'bull'
import { Public, UserFromReq } from 'src/decorators'

@Controller('workout')
@ApiTags('workout')
export class WorkoutsController {
  constructor(
    @InjectQueue('workout') private readonly workoutQueue: Queue,
    private readonly workoutsService: WorkoutsService,
  ) {}

  @Get('one')
  @ApiOperation({ summary: 'Get workout by id' })
  async findById(@Query() params: DefaultParamsDto) {
    const job = await this.workoutQueue.add('getOne', { id: params.id })
    const result = await job.finished()
    return result
  }

  @Get()
  @ApiOperation({
    summary: 'Get several workouts with main info (use pagination)',
  })
  async getWithPagination(
    @Query() dto: PaginationDto,
    @UserFromReq() user: UserModel,
  ) {
    const job = await this.workoutQueue.add('getWithPagination', { dto, user })
    const result = await job.finished()
    return result
  }

  @Delete()
  @ApiOperation({ summary: 'Delete workout by query id' })
  async deleteOneWorkout(
    @Body() dto: DefaultBodyDto,
    @UserFromReq() user: UserModel,
  ) {
    return this.workoutsService.removeOne(dto.id, user?.id || 1)
  }

  @Delete('all')
  @ApiOperation({
    summary: 'Get all workouts, charts, polylines and power curve by user id',
  })
  async deleteAllWorkout(@UserFromReq() user: UserModel) {
    return this.workoutsService.deleteAllWorkouts(user?.id || 1)
  }

  @Public()
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
    @UploadedFile(new FileTypeValidationPipe(['fit'], 5))
    file: Express.Multer.File,
    @UserFromReq() user: UserModel,
  ) {
    const size = file.size / 1024
    console.time(file.originalname + ' - ' + size)
    const res = await this.workoutsService.uploadFile(file, user?.id || 1)
    console.timeEnd(file.originalname + ' - ' + size)
    return res
    // const job = await this.workoutQueue.add(
    //   'upload',
    //   { file, user: user || { id: 1 } },
    // { lifo: true },
    // )
    // const result = await job.finished()
    // return result
  }
}
