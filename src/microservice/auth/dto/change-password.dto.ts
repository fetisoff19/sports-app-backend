import { IsOptional, IsString, Length } from 'class-validator'

export class ChangePasswordDto {
  @IsOptional()
  @IsString()
  @Length(8)
  current: string

  @IsString()
  @Length(8)
  new: string
}
