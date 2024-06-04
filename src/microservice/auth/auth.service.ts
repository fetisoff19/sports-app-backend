import { CryptoHelper } from '@/common/helpers';
import { CustomError } from '@/custom-error';
import { UserModel } from '@/db/model';
import { Injectable } from '@nestjs/common';
import { AuthUserDto, ChangePasswordDto } from '@/microservice/auth/dto';
import { UserService } from '@/microservice/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Payload } from '@/common/types';
import { Response } from 'express';
import { WorkoutsService } from '@/microservice/workout/workout.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly workoutsService: WorkoutsService,
    private readonly jwtService: JwtService,
  ) {}
  
  public async auth(user: UserModel) {
    const workoutCount = await this.workoutsService.getCountByUserUuid(user.uuid)
    const publicUser = this.userService.getPublicUser(user)
    return { ...publicUser, workoutCount }
  }
  
  
  public async login(userAuthApiDto: AuthUserDto, res: Response) {
    const user = await this.validateUser(userAuthApiDto)
    const workoutCount = await this.workoutsService.getCountByUserUuid(user.uuid)
    const payload: Payload = { uuid: user.uuid }
    const token = await this.jwtService.signAsync(payload)
    const publicUser = this.userService.getPublicUser(user)
    return res
      .header({ 'Authorization': `Bearer ${token}` })
      .header('Content-Type', 'application/json')
      .send({ ...publicUser, workoutCount })
  }
  
  public async logout(res: Response) {
    // const { refreshToken } = req.user
    // await this.userService.findAndRemoveRefreshToken(refreshToken)
    // setHeader('access', '', res)
    // setHeader('refresh', '', res)
    return res.header({ 'Authorization': `` })
      .header('Content-Type', 'application/json')
      .send()
  }
  
  public async registration(dto: AuthUserDto, res: Response) {
    await this.userService.isEmailExist(dto.email.toLowerCase())
    const hashPassword = CryptoHelper.hashPassword(dto.password, 10)
    const user = await this.userService.create({
      ...dto,
      password: hashPassword,
    })
    // const payload: Payload = { uuid: user.uuid }
    // const token = await this.jwtService.signAsync(payload)
    const publicUser = this.userService.getPublicUser(user)
    return res
      // .header({'Authorization': `Bearer ${token}` })
      .header('Content-Type', 'application/json')
      .send(publicUser)
      // .send({ ...publicUser, workoutCount: 0 })
  }
  
  public async changePassword(dto: ChangePasswordDto, user: UserModel){
    const passwordEquals = CryptoHelper.compareHashedPasswords(
      dto.current,
      user.password,
    )
    if(!passwordEquals){
      throw new CustomError(404, 'Wrong current password')
    }
    user.password = CryptoHelper.hashPassword(dto.new, 10)
    await this.userService.save(user)
    return true
  }

  private async validateUser(userAuthApiDto: AuthUserDto) {
    const user = await this.userService.findByEmail(userAuthApiDto.email.toLowerCase())
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
  
  public async deleteUser(user: UserModel){
    await this.workoutsService.removeAll(user.uuid)
    return this.userService.remove(user)
  }

}
