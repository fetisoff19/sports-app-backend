import { TokenModule } from '@modules/token/token.module'
import { UserModule } from '@modules/user/user.module'
import { Module } from '@nestjs/common'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [UserModule, TokenModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
