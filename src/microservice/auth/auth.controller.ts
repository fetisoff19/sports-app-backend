import { Public, User } from '@/decorators'
import { Body, Controller, Delete, Get, Patch, Post, Req, Res, UseGuards } from '@nestjs/common'
import { Request, Response } from 'express'
import { AuthUserDto, ChangePasswordDto, EmailDto } from '@/microservice/auth/dto'
import { UserModel } from '@/db/model'
import { ApiTags } from '@nestjs/swagger'
import { GithubAuthGuard, GoogleOauthGuard } from '@/guards'
import * as _ from 'lodash'
import { ConfigService } from '@nestjs/config'
import { UserService } from '@/microservice/user/user.service'
import { CustomError } from '@/custom-error'
import { Payload, PROVIDER_TYPE, UserFromSocialMedia } from '@/common/types'
import { WorkoutsService } from '@/microservice/workout/workout.service'
import { JwtService } from '@nestjs/jwt'
import { CryptoHelper } from '@/common/helpers'
import { MailerService } from '@nestjs-modules/mailer'

type ReqWithSocialMediaUser = Request & {
  user: UserFromSocialMedia
}

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly workoutsService: WorkoutsService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailerService,
  ) {}

  @Post('registration')
  @Public()
  async registration(@Body() dto: AuthUserDto, @Res() res: Response) {
    await this.userService.isEmailExist(dto.email.toLowerCase())
    const hashPassword = CryptoHelper.hashPassword(dto.password, 10)
    const user = await this.userService.createWithPassword({
      ...dto,
      password: hashPassword,
    })
    const publicUser = this.userService.getPublicUser(user)
    return res
      .header('Content-Type', 'application/json')
      .send(publicUser)
  }

  @Post('')
  @Public()
  async login(@Body() dto: AuthUserDto, @Res() res: Response) {
    const user = await this.userService.validateUser(dto)
    const workoutCount = await this.workoutsService.getCountByUserUuid(user.uuid)
    const payload: Payload = { uuid: user.uuid }
    const token = await this.jwtService.signAsync(payload)
    const publicUser = this.userService.getPublicUser(user)
    return res
      .header({ 'Authorization': `Bearer ${token}` })
      .header('Content-Type', 'application/json')
      .send({ ...publicUser, workoutCount })
  }

  @Get('logout')
  async logout(@Res() res: Response) {
    return res.header({ 'Authorization': `` })
      .header('Content-Type', 'application/json')
      .send()
  }

  @Get()
  async auth(@User() user: UserModel) {
    const workoutCount = await this.workoutsService.getCountByUserUuid(user.uuid)
    const publicUser = this.userService.getPublicUser(user)
    return { ...publicUser, workoutCount }
  }

  @Patch('')
  async changePassword(@Body() dto: ChangePasswordDto, @User() user: UserModel) {
    return this.userService.changePassword(dto, user)
  }

  @Delete('')
  async deleteUser(@User() user: UserModel) {
    await this.workoutsService.removeAll(user.uuid)
    return this.userService.remove(user)
  }


  @Get('google/callback')
  @Public()
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req: ReqWithSocialMediaUser, @Res() res: Response) {
    try {
      if(!req?.user?.provider_id){
        throw new CustomError(401, 'User not found!')
      }
      const { provider, provider_id } = req.user
      const userFromDb = await this.userService.findByProvider(provider, provider_id)

      if(!userFromDb) {
        const user = await this.userService.createWithOAuth(req.user)
        const payload: Payload = { uuid: user.uuid }
        const token = await this.jwtService.signAsync(payload)
        res.redirect(`${this.configService.get('auth.clientUrl')}/?token=${token}`)
      }

      const payload: Payload = { uuid: userFromDb.uuid }
      const token = await this.jwtService.signAsync(payload)
      res.redirect(`${this.configService.get('auth.clientUrl')}/?token=${token}`)

    } catch (e: unknown) {
      return res
        .status(_.get(e, 'status', 500))
        .header('Content-Type', 'application/json')
        .send({ message: _.get(e, 'message', 'Internal server error') })
    }
  }

  @Get('github/callback')
  @Public()
  @UseGuards(GithubAuthGuard)
  async githubAuthCallback(@Req() req: ReqWithSocialMediaUser, @Res() res: Response) {
    try {
      if(!req?.user?.provider_id){
        throw new CustomError(401, 'User not found!')
      }
      const { provider, provider_id } = req.user
      const userFromDb = await this.userService.findByProvider(provider, provider_id)

      if(!userFromDb) {
        const user = await this.userService.createWithOAuth(req.user)
        const payload: Payload = { uuid: user.uuid }
        const token = await this.jwtService.signAsync(payload)
        res.redirect(`${this.configService.get('auth.clientUrl')}/?token=${token}`)
      }

      const payload: Payload = { uuid: userFromDb.uuid }
      const token = await this.jwtService.signAsync(payload)
      res.redirect(`${this.configService.get('auth.clientUrl')}/?token=${token}`)

    } catch (e: unknown) {
      return res
        .status(_.get(e, 'status', 500))
        .header('Content-Type', 'application/json')
        .send({ message: _.get(e, 'message', 'Internal server error') })
    }
  }

  @Post('password-recovery')
  @Public()
  async passwordRecovery(@Body() dto: EmailDto, @Res() res: Response) {
    const user = await this.userService.findByEmail(dto.email, PROVIDER_TYPE.EMAIL)
    if(user){
      const payload: Payload = { uuid: user.uuid }
      const token = await this.jwtService.signAsync(payload)
      const message = `Forgot your password? If you didn't forget your password, please ignore this email! Password recovery link: ${this.configService.get('auth.clientUrl')}/?recovery=${token}`
      try{
        this.mailService.sendMail({
          to: user.email,
          subject: `Password Recovery`,
          text: message,
        })
        return res
          .header('Content-Type', 'application/json')
          .send(true)
      } catch (e: unknown) {
        return res
          .status(_.get(e, 'status', 500))
          .header('Content-Type', 'application/json')
          .send({ message: _.get(e, 'message', 'Internal server error') })
      }
    }
    return res
      .header('Content-Type', 'application/json')
      .send(true)
  }
}
