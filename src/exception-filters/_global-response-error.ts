import { ResponseError } from '@/common/types'
import { Request } from 'express'

export function GlobalResponseError(
  statusCode: number,
  message: string,
  request: Request,
): ResponseError {
  return {
    statusCode: statusCode,
    message,
    timestamp: new Date().toString(),
    path: request.url,
    method: request.method,
  }
}
