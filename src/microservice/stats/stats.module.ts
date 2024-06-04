import { Module } from '@nestjs/common'
import { StatsController } from './stats.controller'
import { WorkoutsModule } from '@/microservice/workout/workout.module'
import { PowerCurveModule } from '@/microservice/power-curve/power-curve.module'
import { StatsProcessor } from '@/microservice/stats/stats.processor'
import { BullModule } from '@nestjs/bull'

@Module({
  imports: [
    WorkoutsModule,
    PowerCurveModule,
    BullModule.registerQueue({ name: 'stats' }),
  ],
  controllers: [StatsController],
  providers: [StatsProcessor],
})
export class StatsModule {}
