import { sort, sortParams, sports } from '@common/constants'
import { Type } from 'class-transformer'
import {
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator'

export class PaginationDto {
  @IsOptional()
  @IsString()
  @IsIn(sort)
  direction?: (typeof sort)[number]

  @IsOptional()
  @IsString()
  @IsIn(sortParams)
  param?: (typeof sortParams)[number]

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  limit?: number

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number

  @IsOptional()
  @IsString()
  @IsIn(sports)
  sport?: (typeof sports)[number]
}
