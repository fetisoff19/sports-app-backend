import { CustomError } from '@/custom-error'
import { UserModel } from '@/db/model';
import { UserRepository } from '@/db/repository'
import { Injectable } from '@nestjs/common'
import { omit } from 'lodash'
import { AuthUserDto, ChangePasswordDto } from '@/microservice/auth/dto';
import { PROVIDER_TYPE, PublicUser, UserFromSocialMedia } from '@/common/types';
import { CryptoHelper } from '@/common/helpers';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAndGetPublicUser(uuid: string) {
    const user = await this.userRepository.findByUuid(uuid)
    if (user) {
      return this.getPublicUser(user)
    }
    throw new CustomError(400, 'Пользователь не найден')
  }
  
  async findByUuid(uuid: string): Promise<UserModel | null> {
    return this.userRepository.findByUuid(uuid)
  }

  async isEmailExist(email: string): Promise<void> {
    const isEmailBusy = await this.userRepository.existsByEmail(email)
    if (isEmailBusy) {
      throw new CustomError(400, `User with this email ${email}  exists`)
    }
    return
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    return this.userRepository.findOne({ where: { email } })
  }
  
  async findByProvider(provider: PROVIDER_TYPE, provider_id: string): Promise<UserModel | null> {
    return this.userRepository.findOne({ where: { provider, provider_id } })
  }

  async createWithPassword(dto: AuthUserDto): Promise<UserModel | null> {
    const user = await this.userRepository.save({
      ...dto, userName: dto.email, login: dto.email, provider: PROVIDER_TYPE.EMAIL
    })
    return this.userRepository.findByUuid(user.uuid)
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
    await this.update(user)
    return true
  }
  
  
  public async validateUser(dto: AuthUserDto) {
    const user = await this.findByEmail(dto.email.toLowerCase())
    if (user?.password) {
      const passwordEquals = CryptoHelper.compareHashedPasswords(
        dto.password,
        user.password,
      )
      if (user && passwordEquals) {
        return user
      }
    }
    throw new CustomError(401, 'Wrong email or password')
  }
  
  async createWithOAuth(profile: UserFromSocialMedia): Promise<UserModel | null> {
    const user = await this.userRepository.save(profile)
    return this.userRepository.findByUuid(user.uuid)
  }

  public async update(user: UserModel){
    return this.userRepository.updateOne(user)
  }

  public getPublicUser(user: UserModel): PublicUser {
    return omit(user, ['uuid', 'password', 'created_at', 'updated_at', 'provider_id'])
  }
  
  async remove(user: UserModel) {
    return this.userRepository.removeOne(user)
  }
  
}
