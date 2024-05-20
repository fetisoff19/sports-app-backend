import { WorkoutModel, SessionModel, UserModel, ChartDataModel, PolylineModel, PowerCurveModel } from '@/db/model';
import {
  WorkoutRepository,
  SessionRepository,
} from '@/db/repository';
import { BullModule } from '@nestjs/bull';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisClientOptions } from 'redis';
import { WorkoutsService } from '@/microservice/workout/workout.service';
import { WorkoutsController } from '@/microservice/workout/workout.controller';
import { PolylineModule } from '@/microservice/polyline/polyline.module';
import { PowerCurveModule } from '@/microservice/power-curve/power-curve.module';
import { ChartsDataModule } from '@/microservice/charts-data/charts-data.module';
import { WorkoutProcessor } from '@/microservice/workout/workout.processor';


@Module({
  imports: [
    ConfigModule,
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
