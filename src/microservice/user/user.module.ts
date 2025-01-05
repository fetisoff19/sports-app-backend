import { UserModel } from '@/db/model'
import { UserRepository } from '@/db/repository'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserService } from './user.service'

@Module({
  imports: [TypeOrmModule.forFeature([UserModel])],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
