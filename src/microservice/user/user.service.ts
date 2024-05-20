import { CustomError } from '@/custom-error';
import { UserModel } from '@/db/model';
import { UserRepository } from '@/db/repository';
import { Injectable } from '@nestjs/common';
import { omit } from 'lodash';
import { AuthUserDto } from '@/microservice/auth/dto';
import { PublicUser } from '@/common/types';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAndGetPublicUser(uuid: string) {
    const user = await this.userRepository.findByUuid(uuid);
    if (user) {
      return this.getPublicUser(user);
    }
    throw new CustomError(400, 'Пользователь не найден');
  }

  async findAll() {
    return this.userRepository.findAll();
    // return this.userRepository.find({
    //   relations: {
    //     workouts: {
    //       session: true,
    //       polyline: true,
    //       powerCurve: true,
    //       chartData: true
    //     }
    //   }
    // })
  }

  async findByUuid(uuid: string): Promise<UserModel | null> {
    return this.userRepository.findByUuid(uuid);
  }

  async isEmailExist(email: string): Promise<void> {
    const isEmailBusy = await this.userRepository.findOne({ where: { email } });
    if (isEmailBusy) {
      throw new CustomError(400, `Пользователь с email ${email} уже существует`);
    }
    return;
  }

  // async deleteUser(id: string): Promise<string> {
  //   const { email } = await this.userModel.findByIdAndRemove(id)
  //   if (email) {
  //     await this.workoutService.deleteAllWorkouts(id)
  //     return email
  //   }
  //   throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)
  // }
  //
  async findByEmail(email: string): Promise<UserModel | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  // async findAndRemoveRefreshToken(refreshToken: string) {
  //   const user = await this.userRepository.findOne({ where: { refreshToken } })
  //   return this.userRepository.updateOne({
  //     ...user,
  //     refreshToken: null,
  //   } as UserModel)
  // }

  // async findByRefreshAndEmail(refreshToken: string, email: string) {
  //   return this.userRepository.findOne({ where: { email, refreshToken } })
  // }

  async findAndUpdate(user: UserModel, data: Partial<UserModel>): Promise<UserModel | null> {
    for (const key in data) {
      if (Array.isArray(user[key])) {
        user[key] = [...user[key], data[key]];
      } else user[key] = data[key];
    }
    return this.userRepository.save(user);
  }

  async create(dto: AuthUserDto): Promise<UserModel | null> {
    // user.stats = stats
    return this.userRepository.save({ ...dto, userName: dto.email, login: dto.email });
  }

  async remove(user: UserModel) {
    return this.userRepository.removeOne(user);
  }
  //
  // async createSocialMediaUser(email: string, token: string): Promise<UserFromReq> {
  //   try {
  //     const user = new this.userModel({ email, token })
  //     // user.stats = stats
  //     return user.save()
  //   } catch (e) {
  //     throw new HttpException(
  //       'Ошибка на сервере при создании пользователя',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     )
  //   }
  // }
  //
  public getPublicUser(user: UserModel): PublicUser {
    return omit(user, ['uuid', 'password', 'createdAt', 'updatedAt']);
  }
}
