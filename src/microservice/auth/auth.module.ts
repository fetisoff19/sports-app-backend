import { Module } from '@nestjs/common'

import { AuthController } from './auth.controller'
import { UserModule } from '@/microservice/user/user.module'
import { JwtModule } from '@nestjs/jwt'
import { WorkoutsModule } from '@/microservice/workout/workout.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'
import { GithubStrategy, GoogleStrategy, JwtAuthStrategy } from '@/strateges/'
import { MailerModule } from '@nestjs-modules/mailer'

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
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ({
          transport: {
            host: configService.get<string>('mailer.host'),
            secure: true,
            auth: {
              user: configService.get<string>('mailer.username'),
              pass: configService.get<string>('mailer.password'),
            },
          },
          defaults: {
            from: `Sports App  <${configService.get<string>('mailer.username')}>`,
          },
        }),
    }),
  ],
  providers: [JwtAuthStrategy, GoogleStrategy, GithubStrategy],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
