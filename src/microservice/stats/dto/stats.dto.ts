import { IsIn, IsISO8601, IsOptional } from 'class-validator'
import { sports } from '@/common/constants'
import { Transform } from 'class-transformer'

export class StatsDto {
  @IsOptional()
  @IsIn(sports)
  @Transform(({ value }) => value === 'all' ? null : value)
  sport: (typeof sports)[number] | null

  @IsISO8601()
  @Transform(({ value }) =>
    new Date((new Date(value).setHours(0, 0, 0))).toISOString())
  start: string

  @IsISO8601()
  @Transform(({ value }) =>
    new Date((new Date(value).setHours(23, 59, 999))).toISOString())
  end: string
}
