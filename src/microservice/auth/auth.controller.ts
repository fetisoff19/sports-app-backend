import { CustomRequest } from '@common/types'
import { Public } from '@decorators'
import { AuthGuard } from '@guards/auth-guard.service'
import { AuthUserDto } from '@modules/auth/dto'
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'

import { AuthService } from './auth.service'

// @SetMetadata('google-login', true)
// @UseGuards(GoogleOAuthGuard)
@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('registration')
  @HttpCode(201)
  async registration(@Body() userAuthApiDto: AuthUserDto) {
    return this.authService.registration(userAuthApiDto)
  }

  @Public()
  @Post('')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Will return user info and tokens in header',
  })
  async login(@Body() userAuthApiDto: AuthUserDto, @Res() res: Response) {
    return this.authService.login(userAuthApiDto, res)
  }

  @Get('logout')
  @ApiResponse({
    description: 'Need remove tokens in local storage',
  })
  async logout(@Req() req: CustomRequest, @Res() res: Response) {
    return this.authService.logout(req, res)
  }

  @Get()
  @ApiResponse({
    description: 'Will return user info without private fields',
  })
  async auth(@Req() req: CustomRequest) {
    return this.authService.auth(req.user)
  }

  // @Get()
  // async googleAuth(@Req() _req: Request) {
  //   console.log(82)
  // }
  //
  // @Get('google-redirect')
  // googleAuthRedirect(@HttpUser() user: GoogleLoginUserDto) {
  //   console.log('google-redirect')
  //   return this.authService.googleLogin(user)
  // }
}
