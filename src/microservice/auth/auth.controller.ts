import { Public, User } from '@/decorators';
import {
  Body,
  Controller,
  Get,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express'
import { AuthService } from './auth.service';
import { AuthUserDto } from '@/microservice/auth/dto';
import { UserModel } from '@/db/model';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('registration')
  async registration(@Body() userAuthApiDto: AuthUserDto, @Res() res: Response) {
    return this.authService.registration(userAuthApiDto, res);
  }

  @Public()
  @Post('')
  async login(@Body() userAuthApiDto: AuthUserDto, @Res() res: Response) {
    return this.authService.login(userAuthApiDto, res);
  }

  @Get('logout')
  async logout(@Res() res: Response) {
    return this.authService.logout(res);
  }

  @Get()
  async auth(@User() user: UserModel) {
    return this.authService.auth(user);
  }
}