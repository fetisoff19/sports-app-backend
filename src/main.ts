import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as process from 'node:process'
import {
  HttpExceptionFilter,
  TypeORMExceptionFilter,
} from '@/exception-filters'
import { CustomValidationPipe } from '@/pipes'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import * as fs from 'node:fs'
import { join } from 'path'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  })

  app.enableCors({
    exposedHeaders: 'Authorization',
  })

  const configService = app.get<ConfigService>(ConfigService)
  const port = configService.get<number>('port')

  app.setGlobalPrefix('api')
  app.useGlobalPipes(new CustomValidationPipe())
  app.useGlobalFilters(new TypeORMExceptionFilter(), new HttpExceptionFilter())

  const config = new DocumentBuilder().setTitle('sports-app').build()
  const document = SwaggerModule.createDocument(app, config)
  if(process?.env?.NODE_ENV !== 'prod'){
    SwaggerModule.setup('api', app, document)
  }

  const path = configService.get('log.dir')
  await fs.promises.mkdir(join(__dirname, '..', path), { recursive: true })

  await app
    .listen(port, '0.0.0.0')
    .then(() =>
      console.log(`⚡️ [server]: Server is running on port = ${port}`),
    )
}

bootstrap()
