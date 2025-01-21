import { Module } from '@nestjs/common'
import { NotificationService } from './notification.service'
import { NotificationController } from './notification.controller'
import { MailerModule } from '@nestjs-modules/mailer'
import { ConfigModule, ConfigService } from '@nestjs/config'
import config from '@/config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
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
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
