import { IsString, Length } from 'class-validator'

export class ChangePasswordDto {
  @IsString()
  @Length(8)
  current: string
  
  @IsString()
  @Length(8)
  new: string
}
