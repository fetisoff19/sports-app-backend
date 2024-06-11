import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@/microservice/user/user.service';
import { Payload } from '@/common/types';
import { CustomError } from '@/custom-error';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.secret'),
    });
  }
  
  async validate(payload: Payload) {
    const user = await this.userService.findByUuid(payload.uuid)
    if(!user) {
      throw new CustomError(401, 'Auth error')
    }
    
    return user
  }
}
