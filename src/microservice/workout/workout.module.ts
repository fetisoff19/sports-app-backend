import { SessionModel, WorkoutModel } from '@/db/model'
import { SessionRepository, WorkoutRepository } from '@/db/repository'
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
import { CacheModule } from '@nestjs/cache-manager'

@Module({
  imports: [
    ConfigModule,
    PolylineModule,
    PowerCurveModule,
    ChartsDataModule,
    TypeOrmModule.forFeature([WorkoutModel, SessionModel]),
    BullModule.registerQueue({ name: 'workout' }),
    CacheModule.register(),
  ],
  controllers: [WorkoutsController],
  providers: [
    WorkoutsService,
    WorkoutRepository,
    SessionRepository,
    WorkoutProcessor,
  ],
  exports: [WorkoutsService],
})
export class WorkoutsModule {}
