import { CryptoHelper } from '@common/helpers'
import { CustomRequest } from '@common/types'
import { CustomError } from '@custom-error'
import { UserModel } from '@db/model'
import { AuthUserDto } from '@modules/auth/dto'
import { TokenService } from '@modules/token/token.service'
import { UserService } from '@modules/user/user.service'
import { Injectable } from '@nestjs/common'
import { Response } from 'express'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async auth(user: UserModel) {
    return this.userService.getPublicUser(user)
  }

  async login(userAuthApiDto: AuthUserDto, res: Response) {
    const user = await this.validateUser(userAuthApiDto)
    const accessToken = this.tokenService.generateAccessToken(user)
    const refreshToken = this.tokenService.generateRefreshToken(user)
    const updatedUser = await this.userService.findAndUpdate(user, {
      refreshToken,
    })
    const publicUser = this.userService.getPublicUser(updatedUser)
    return res
      .set({ 'x-access-token': accessToken, 'x-refresh-token': refreshToken })
      .json(publicUser)
  }

  async logout(req: CustomRequest, res: Response) {
    const { refreshToken } = req.user
    await this.userService.findAndRemoveRefreshToken(refreshToken)
    // setHeader('access', '', res)
    // setHeader('refresh', '', res)
    return res.set({ 'x-access-token': '', 'x-refresh-token': '' }).send()
  }

  async registration(dto: AuthUserDto) {
    await this.userService.isEmailExist(dto.email)
    const hashPassword = CryptoHelper.hashPassword(dto.password, 10)
    return this.userService.create({
      ...dto,
      password: hashPassword,
    })
  }

  private async validateUser(userAuthApiDto: AuthUserDto) {
    const user = await this.userService.findByEmail(userAuthApiDto.email)
    if (user) {
      const passwordEquals = CryptoHelper.compareHashedPasswords(
        userAuthApiDto.password,
        user.password,
      )
      if (user && passwordEquals) {
        return user
      }
    }
    throw new CustomError(401, 'Wrong email or password')
  }

  // async googleLogin(user: GoogleLoginUserDto) {
  //   console.log(83, user)
  //   if (!user) {
  //     throw new UnauthorizedException('No user from google')
  //   }
  //   const {
  //     firstName,
  //     lastName,
  //     email,
  //     email_verified,
  //     expires_in,
  //     picture,
  //     providerAccountId,
  //     accessToken,
  //     refreshToken,
  //     id_token,
  //   } = user
  //   // console.log(user)
  //
  //   const currentUser = await this.userRepository.findOne({
  //     rejectOnEmpty: undefined,
  //     where: { email },
  //     include: [
  //       { model: Account, as: 'accounts' },
  //       { model: Workout, as: 'workouts', include: [{ model: Info, as: 'info' }] },
  //     ],
  //   })
  //   console.log(JSON.stringify(currentUser, null, 2))
  //   if (!currentUser) {
  //     const newUserData = await this.userRepository.create(
  //       {
  //         name: `${firstName} ${lastName}`,
  //         email,
  //         emailVerified: email_verified ? new Date().toISOString() : null,
  //         image: picture,
  //         accounts: {
  //           type: 'oauth',
  //           provider: 'google',
  //           providerAccountId: providerAccountId,
  //           access_token: accessToken,
  //           refresh_token: refreshToken,
  //           id_token: id_token,
  //           expires_at: expires_in,
  //         },
  //       },
  //       {
  //         include: Account,
  //       },
  //     )
  //     const access_token = await this.signJwt(newUserData.id, id_token, accessToken, expires_in)
  //     return { access_token }
  //   }
  //   const access_token = await this.signJwt(currentUser.id, id_token, accessToken, expires_in)
  //   return { access_token }
  // }
  // signJwt(
  //   userId: string,
  //   id_token: string,
  //   access_token: string,
  //   expires_at: number,
  //   expiresIn = '1d',
  // ): Promise<string> {
  //   const payload: IJWTPayload = {
  //     sub: userId,
  //     id_token,
  //     access_token,
  //     expires_at,
  //   }
  //   return this.jwtService.signAsync(payload, {
  //     expiresIn,
  //     secret: this.configService.get('appSecret'),
  //   })
  // }
}
