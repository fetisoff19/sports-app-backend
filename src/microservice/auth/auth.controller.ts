import { Public, User } from '@/decorators'
import {
  Body,
  Controller, Delete,
  Get, Patch,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express'
import { AuthService } from './auth.service'
import { AuthUserDto, ChangePasswordDto } from '@/microservice/auth/dto';
import { UserModel } from '@/db/model'
import { ApiTags } from '@nestjs/swagger'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('registration')
  async registration(@Body() dto: AuthUserDto, @Res() res: Response) {
    return this.authService.registration(dto, res)
  }

  @Public()
  @Post('')
  async login(@Body() dto: AuthUserDto, @Res() res: Response) {
    return this.authService.login(dto, res)
  }

  @Get('logout')
  async logout(@Res() res: Response) {
    return this.authService.logout(res)
  }

  @Get()
  async auth(@User() user: UserModel) {
    return this.authService.auth(user)
  }
  
  @Patch('')
  async changePassword(@Body() dto: ChangePasswordDto, @User() user: UserModel) {
    return this.authService.changePassword(dto, user)
  }
  
  @Delete('')
  async deleteUser(@User() user: UserModel) {
    return this.authService.deleteUser(user)
  }
}
