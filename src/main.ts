import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as process from 'node:process'
import { HttpExceptionFilter, TypeORMExceptionFilter } from '@/exception-filters'
import { CustomValidationPipe } from '@/pipes'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import * as fs from 'node:fs'
import { join } from 'path'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { NotificationModule } from '@/microservice/notification/notification.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  })
  app.enableCors({
    exposedHeaders: 'Authorization',
    origin: [process.env.CLIENT_URL],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: false,
  })

  const configService = app.get<ConfigService>(ConfigService)
  const appPort = configService.get<number>('port')
  const appHost = configService.get<string>('host')

  app.setGlobalPrefix('api')
  app.useGlobalPipes(new CustomValidationPipe())
  app.useGlobalFilters(new TypeORMExceptionFilter(), new HttpExceptionFilter())

  const config = new DocumentBuilder().setTitle('sports-app').build()
  const document = SwaggerModule.createDocument(app, config)
  if (process?.env?.NODE_ENV !== 'prod') {
    SwaggerModule.setup('api', app, document)
  }

  const path = configService.get('log.dir')
  await fs.promises.mkdir(join(__dirname, '..', path), { recursive: true })

  await app
    .listen(appPort, appHost)
    .then(() => console.log(`⚡️ [server]: Server is running on port = ${appPort}`))


  const notificationApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationModule,
    {
      transport: Transport.REDIS,
      options: {
        port: configService.get<number>('redis.port'),
        host: configService.get<string>('redis.host'),
      },
    },
  )
  await notificationApp
    .listen()
    .then(() => console.log(`⚡️ [microservice]: NotificationApp is running`))

}

bootstrap()
