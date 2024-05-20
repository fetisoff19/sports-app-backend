import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './microservice/auth';
import config from './config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { AuthGuard } from '@/guards';
import { HttpExceptionFilter, TypeORMExceptionFilter } from '@/exception-filters';
import { CustomValidationPipe } from '@/pipes';


@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [config],
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
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('db.host'),
        port: configService.get<number>('db.port'),
        username: configService.get<string>('db.user'),
        password: configService.get<string>('db.pass'),
        database: configService.get<string>('db.name'),
        synchronize: false,
        autoLoadEntities: true,
      }),
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 200,
    }]),
  ],
  controllers: [AppController],
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
