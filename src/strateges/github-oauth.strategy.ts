import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Profile, Strategy } from 'passport-github';
import { PROVIDER_TYPE, UserFromSocialMedia } from '@/common/types';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('auth.githubClientId'),
      clientSecret: configService.get<string>('auth.githubClientSecret'),
      callbackURL: configService.get<string>('auth.githubCallbackUrl'),
      scope: ['public_profile', 'email'],
    });
  }
  
  async validate(_accessToken: string, _refreshToken: string, profile: Profile) {
    const { id,  username, photos } = profile;
    
    const user: UserFromSocialMedia = {
      provider: PROVIDER_TYPE.GITHUB,
      provider_id: id,
      login: username,
      image: photos[0].value,
    }
    return user
  }
}
