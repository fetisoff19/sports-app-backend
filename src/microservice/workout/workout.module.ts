import { WorkoutInfoModel, WorkoutModel, WorkoutSessionModel } from '@db/model'
import {
  WorkoutInfoRepository,
  WorkoutRepository,
  WorkoutSessionRepository,
} from '@db/repository'
import { ChartsDataModule } from '@modules/charts-data/charts-data.module'
import { PolylineModule } from '@modules/polyline/polyline.module'
import { PowerCurveModule } from '@modules/power-curve/power-curve.module'
import { UserModule } from '@modules/user/user.module'
import { WorkoutsController } from '@modules/workout/workout.controller'
import { WorkoutProcessor } from '@modules/workout/workout.processor'
import { WorkoutsService } from '@modules/workout/workout.service'
import { BullModule } from '@nestjs/bull'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { redisStore } from 'cache-manager-redis-yet'
import { RedisClientOptions } from 'redis'

@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        isGlobal: true,
        ttl: 3600 * 1000,
        store: redisStore,
        url: `redis://${configService.get<string>('redis.host')}:${configService.get<number>('redis.port')}`,
      }),
    }),
    BullModule.registerQueue({ name: 'workout' }),
    UserModule,
    PolylineModule,
    PowerCurveModule,
    ChartsDataModule,
    TypeOrmModule.forFeature([
      WorkoutModel,
      WorkoutInfoModel,
      WorkoutInfoModel,
      WorkoutSessionModel,
    ]),
  ],
  controllers: [WorkoutsController],
  providers: [
    WorkoutsService,
    WorkoutRepository,
    WorkoutInfoRepository,
    WorkoutSessionRepository,
    WorkoutProcessor,
  ],
  exports: [WorkoutsService],
})
export class WorkoutsModule {}
