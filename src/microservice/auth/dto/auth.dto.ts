import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator'

export class AuthUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  @Length(8)
  password: string
}
