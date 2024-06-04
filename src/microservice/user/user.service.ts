import { CustomError } from '@/custom-error'
import { UserModel } from '@/db/model'
import { UserRepository } from '@/db/repository'
import { Injectable } from '@nestjs/common'
import { omit } from 'lodash'
import { AuthUserDto } from '@/microservice/auth/dto'
import { PublicUser } from '@/common/types'

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

  async create(dto: AuthUserDto): Promise<UserModel | null> {
    return this.userRepository.save({ ...dto, userName: dto.email, login: dto.email })
  }

  public async save(user: UserModel){
    return this.userRepository.updateOne(user)
  }

  public getPublicUser(user: UserModel): PublicUser {
    return omit(user, ['uuid', 'password', 'created_at', 'updated_at'])
  }
  
  
  async remove(user: UserModel) {
    return this.userRepository.removeOne(user)
  }
  
}
