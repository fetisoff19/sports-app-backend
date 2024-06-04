import { WorkoutModel, SessionModel } from '@/db/model'
import {
  WorkoutRepository,
  SessionRepository,
} from '@/db/repository'
import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WorkoutsService } from '@/microservice/workout/workout.service'
import { WorkoutsController } from '@/microservice/workout/workout.controller'
import { PolylineModule } from '@/microservice/polyline/polyline.module'
import { PowerCurveModule } from '@/microservice/power-curve/power-curve.module'
import { ChartsDataModule } from '@/microservice/charts-data/charts-data.module'
import { WorkoutProcessor } from '@/microservice/workout/workout.processor'


@Module({
  imports: [
    ConfigModule,
    BullModule.registerQueue({ name: 'workout' }),
    PolylineModule,
    PowerCurveModule,
    ChartsDataModule,
    TypeOrmModule.forFeature([
      WorkoutModel,
      SessionModel,
    ]),
  ],
  controllers: [
    WorkoutsController,
  ],
  providers: [
    WorkoutsService,
    WorkoutRepository,
    SessionRepository,
    WorkoutProcessor,
  ],
  exports: [WorkoutsService],
})
export class WorkoutsModule {}
