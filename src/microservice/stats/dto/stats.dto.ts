import { IsIn, IsISO8601, IsOptional } from 'class-validator';
import { sports } from '@/common/constants'
import { Transform } from 'class-transformer'

export class StatsDto {
  @IsOptional()
  @IsIn(sports)
  @Transform(({ value }) => value === 'all' ? null : value)
  sport: (typeof sports)[number] | null
  
  @IsISO8601()
  start: string
  
  @IsISO8601()
  end: string
}
