import { IsDate } from 'class-validator'
import { Transform, Type } from 'class-transformer'

export class PowerCurveDto {

  @IsDate()
  @Type(() => Date)
  @Transform(({ value }) =>  new Date(new Date(value.setHours(0, 0, 0, 0)).toISOString()))
  start: string

  @IsDate()
  @Type(() => Date)
  @Transform(({ value }) =>  new Date(new Date(value.setHours(23, 56, 59)).toISOString()))
  @IsDate()
  end: string
}
