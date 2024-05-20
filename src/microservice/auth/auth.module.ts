
import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '@/microservice/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { WorkoutsModule } from '@/microservice/workout/workout.module';

@Module({
  imports: [
    UserModule,
    WorkoutsModule,
    JwtModule.register({
    global: true,
    secret: 'sa_secret',
    signOptions: { expiresIn: '60d' },
  })],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
