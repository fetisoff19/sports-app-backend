import { sort, sortParams, sports } from '@/common/constants'
import { Type } from 'class-transformer'
import {
  IsIn,
  IsInt,
  IsPositive,
  IsString,
  Min,
} from 'class-validator'

export class PaginationDto {
  @IsString()
  @IsIn(sort)
  direction: (typeof sort)[number]

  @IsString()
  @IsIn(sortParams)
  param: (typeof sortParams)[number]

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  limit: number

  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset: number

  @IsString()
  @IsIn(sports)
  sport: (typeof sports)[number]

  @IsString()
  name: string
}
