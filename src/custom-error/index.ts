import { errorCodes, errorStatus } from '@common/constants'
import { HttpException } from '@nestjs/common'

export class CustomError extends HttpException {
  constructor(code: (typeof errorCodes)[number], message: string) {
    super(message, errorStatus[code])
  }
}
