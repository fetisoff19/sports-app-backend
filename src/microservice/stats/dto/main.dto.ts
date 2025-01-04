import { IsOptional } from 'class-validator'
import { Transform } from 'class-transformer'

export class MainDto {
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase() === 'true')
  withDates?: boolean
}
