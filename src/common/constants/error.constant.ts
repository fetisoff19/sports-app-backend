import { HttpStatus } from '@nestjs/common';

export const errorCodes = [400, 401, 403, 404, 422, 500] as const;

export const errorStatus = {
  400: HttpStatus.BAD_REQUEST,
  401: HttpStatus.UNAUTHORIZED,
  403: HttpStatus.FORBIDDEN,
  404: HttpStatus.NOT_FOUND,
  422: HttpStatus.UNPROCESSABLE_ENTITY,
  500: HttpStatus.INTERNAL_SERVER_ERROR,
};
