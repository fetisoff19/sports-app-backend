import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserModel } from '../model';

@Injectable()
export class UserDbRepository {
  constructor(
    @InjectRepository(UserModel)
    private readonly repository: Repository<UserModel>,
  ) {}

  private getBaseQuery() {
    return this.repository
      .createQueryBuilder('user');
  }

  public async findByUuid(uuid: string): Promise<UserModel> {
    return this.getBaseQuery()
      .andWhere('user.uuid = :uuid', { uuid })
      .getOne();
  }

  public async create(email: string, password: string): Promise<UserModel> {
    const user = this.repository.create({ email, login: email, password });
    return this.repository.save(user);
  }
}
