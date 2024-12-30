import { Module } from '@nestjs/common'
import config from './config'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { BullModule } from '@nestjs/bull'
import { ThrottlerModule } from '@nestjs/throttler'
import { TypeOrmModule } from '@nestjs/typeorm'
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core'
import { HttpExceptionFilter, TypeORMExceptionFilter } from '@/exception-filters'
import { CustomValidationPipe } from '@/pipes'
import { DbConfig } from '@/db/config'
import { UserModule } from '@/microservice/user/user.module'
import { AuthModule } from '@/microservice/auth/auth.module'
import { WorkoutsModule } from '@/microservice/workout/workout.module'
import { PolylineModule } from '@/microservice/polyline/polyline.module'
import { ChartsDataModule } from '@/microservice/charts-data/charts-data.module'
import { PowerCurveModule } from '@/microservice/power-curve/power-curve.module'
import { StatsModule } from '@/microservice/stats/stats.module'
import { JwtGuard } from '@/guards'
import { CacheModule } from '@nestjs/cache-manager'
import { RedisClientOptions } from 'redis'
import { redisStore } from 'cache-manager-redis-yet'
import { pinoConfig } from '@/common/helpers'
import { LoggerModule } from 'nestjs-pino'


@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 200,
    }]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const dir = configService.get('log.dir')
        const token = configService.get<string>('log.token')
        return ({
          pinoHttp: pinoConfig(token, dir),
        })
      },
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('redis.host'),
          port: configService.get<number>('redis.port'),
        },
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: true,
          timeout: 60000,
        },
      }),
    }),
    TypeOrmModule.forRootAsync({
      useClass: DbConfig,
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        isGlobal: true,
        store: redisStore,
        url: `redis://${configService.get<string>('redis.host')}:${configService.get<number>('redis.port')}`,
      }),
    }),
    UserModule,
    AuthModule,
    WorkoutsModule,
    PolylineModule,
    ChartsDataModule,
    PowerCurveModule,
    StatsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_FILTER,
      useClass: TypeORMExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useClass: CustomValidationPipe,
    },
  ],

})
export class AppModule {}
