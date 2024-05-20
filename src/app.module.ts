import { Module } from '@nestjs/common';
import config from './config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { AuthGuard } from '@/guards';
import { HttpExceptionFilter, TypeORMExceptionFilter } from '@/exception-filters';
import { CustomValidationPipe } from '@/pipes';
import { DbConfig } from '@/db/config';
import { UserModule } from '@/microservice/user/user.module';
import { AuthModule } from '@/microservice/auth/auth.module';
import { WorkoutsModule } from '@/microservice/workout/workout.module';
import { PolylineModule } from '@/microservice/polyline/polyline.module';
import { ChartsDataModule } from '@/microservice/charts-data/charts-data.module';
import { PowerCurveModule } from '@/microservice/power-curve/power-curve.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { LoggerModule } from 'nestjs-pino';
import { pinoConfig } from '@/common/helpers';
import fs from 'node:fs';


@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 200,
    }]),
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [config],
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return ({
          pinoHttp: pinoConfig(configService.get<string>('log.token')),
        });
      }
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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'files'),
    }),
    TypeOrmModule.forRootAsync({
      useClass: DbConfig,
    }),
    UserModule,
    AuthModule,
    WorkoutsModule,
    PolylineModule,
    ChartsDataModule,
    PowerCurveModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
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