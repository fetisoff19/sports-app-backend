import { ExceptionResponse } from '@/common/types'
import { GlobalResponseError } from '@/exception-filters/_global-response-error'
import { ArgumentsHost, Catch, ExceptionFilter, InternalServerErrorException } from '@nestjs/common'
import { Request, Response } from 'express'
import { QueryFailedError, TypeORMError } from 'typeorm'

@Catch(TypeORMError, QueryFailedError)
export class TypeORMExceptionFilter implements ExceptionFilter {
  private defaultExceptionResponse =
    new InternalServerErrorException().getResponse() as ExceptionResponse

  private exceptionResponse: ExceptionResponse = this.defaultExceptionResponse

  catch(exception: TypeORMError | QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const request = ctx.getRequest<Request>()
    const response = ctx.getResponse<Response>()

    const status = this.exceptionResponse.statusCode
    response
      .status(status)
      .send(GlobalResponseError(status, exception.message, request))
  }
}
