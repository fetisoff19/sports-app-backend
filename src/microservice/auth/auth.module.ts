import { Module } from '@nestjs/common'

import { AuthController } from './auth.controller'
import { UserModule } from '@/microservice/user/user.module'
import { JwtModule } from '@nestjs/jwt'
import { WorkoutsModule } from '@/microservice/workout/workout.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'
import { GithubStrategy, GoogleStrategy, JwtAuthStrategy } from '@/strateges/'
import { ClientsModule, Transport } from '@nestjs/microservices'

@Module({
  imports: [
    UserModule,
    WorkoutsModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('auth.secret'),
          signOptions: {
            expiresIn: configService.get<string>('auth.expiresIn'),
          },
          global: true,
        }
      },
    }),
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: 'NOTIFICATION_SERVICE',
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.REDIS,
          options: {
            port: configService.get<number>('redis.port'),
            host: configService.get<string>('redis.host'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [JwtAuthStrategy, GoogleStrategy, GithubStrategy],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
