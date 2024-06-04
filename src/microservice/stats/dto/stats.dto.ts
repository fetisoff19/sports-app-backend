import { IsDate, IsIn, IsOptional } from 'class-validator'
import { sports } from '@/common/constants'
import { Transform, Type } from 'class-transformer'

export class StatsDto {
  @IsOptional()
  @IsIn(sports)
  @Transform(({ value }) => value === 'all' ? null : value)
  sport: (typeof sports)[number] | null
  
  @IsDate()
  @Type(() => Date)
  @Transform(({ value }) => new Date(new Date(value.setHours(0, 0, 0)).toISOString()))
  start: string
  
  @IsDate()
  @Type(() => Date)
  @Transform(({ value }) =>  new Date(new Date(value.setHours(23, 56, 59)).toISOString()))
  @IsDate()
  end: string
}
