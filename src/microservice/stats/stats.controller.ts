import { Controller, Get, Query, Res, ValidationPipe } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { User } from '@/decorators'
import { UserModel } from '@/db/model'
import { CustomError } from '@/custom-error'
import { PowerCurveDto, StatsDto } from '@/microservice/stats/dto'
import { Response } from 'express'
import * as _ from 'lodash'
import { MainDto } from '@/microservice/stats/dto/main.dto'

@Controller('stats')
@ApiTags('stats')
export class StatsController {
  constructor(@InjectQueue('stats') private readonly workoutQueue: Queue) {}

  @Get('main')
  async getMainStats(
    @Query(new ValidationPipe({ transform: true })) dto: MainDto,
    @User() user: UserModel,
    @Res() res: Response,
  ) {
    try {
      const job = await this.workoutQueue.add('main', { dto, user })
      const result = await job.finished()
      if (!result) {
        throw new CustomError(500, 'Internal server error')
      }
      return res
        .status(200)
        .header('Content-Type', 'application/json')
        .send(result)
    } catch (e: unknown) {
      return res
        .status(_.get(e, 'status', 500))
        .header('Content-Type', 'application/json')
        .send({ message: _.get(e, 'message', 'Internal server error') })
    }
  }

  @Get('table')
  async getTableStats(
    @Query(new ValidationPipe({ transform: true })) dto: StatsDto,
    @User() user: UserModel,
    @Res() res: Response,
  ) {
    try {
      const job = await this.workoutQueue.add('table', { dto, user })
      const result = await job.finished()
      if (!result) {
        throw new CustomError(500, 'Internal server error')
      }
      return res
        .status(200)
        .header('Content-Type', 'application/json')
        .send(result)
    } catch (e: unknown) {
      return res
        .status(_.get(e, 'status', 500))
        .header('Content-Type', 'application/json')
        .send({ message: _.get(e, 'message', 'Internal server error') })
    }
  }

  @Get('chart')
  async getChartStats(
    @Query(new ValidationPipe({ transform: true })) dto: StatsDto,
    @User() user: UserModel,
    @Res() res: Response,
  ) {
    try {
      const job = await this.workoutQueue.add('chart', { dto, user })
      const result = await job.finished()
      if (!result) {
        throw new CustomError(500, 'Internal server error')
      }
      return res
        .status(200)
        .header('Content-Type', 'application/json')
        .send(result)
    } catch (e: unknown) {
      return res
        .status(_.get(e, 'status', 500))
        .header('Content-Type', 'application/json')
        .send({ message: _.get(e, 'message', 'Internal server error') })
    }
  }

  @Get('power-curve')
  async getPowerCurve(
    @Query(new ValidationPipe({ transform: true })) dto: PowerCurveDto,
    @User() user: UserModel,
    @Res() res: Response,
  ) {
    try {
      const job = await this.workoutQueue.add('power-curve', { dto, user })
      const result = await job.finished()
      if (!result) {
        throw new CustomError(500, 'Internal server error')
      }
      return res
        .status(200)
        .header('Content-Type', 'application/json')
        .send(result)
    } catch (e: unknown) {
      return res
        .status(_.get(e, 'status', 500))
        .header('Content-Type', 'application/json')
        .send({ message: _.get(e, 'message', 'Internal server error') })
    }
  }
}
