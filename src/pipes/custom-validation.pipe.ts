import { CustomError } from '@/custom-error';
import { ArgumentMetadata, Injectable, Type } from '@nestjs/common';
import { PipeTransform } from '@nestjs/common/interfaces/features/pipe-transform.interface';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object || {});
    if (errors.length > 0) {
      const message = errors
        .map((error) => Object.values(error.constraints).join(', '))
        .join(', ');
      throw new CustomError(500, message);
    }
    return value;
  }

  private toValidate(metatype: Type<unknown>): boolean {
    const types: Type<unknown>[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
