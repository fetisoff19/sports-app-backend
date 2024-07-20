import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, VerifyCallback } from 'passport-google-oauth2'
import { ConfigService } from '@nestjs/config'
import { GoogleProfile, PROVIDER_TYPE, UserFromSocialMedia } from '@/common/types'


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('auth.googleClientId'),
      clientSecret: configService.get<string>('auth.googleClientSecret'),
      callbackURL: configService.get<string>('auth.googleCallbackUrl'),
      scope: ['profile', 'email'],
    })
  }
  
  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: GoogleProfile,
    done: VerifyCallback,
  ) {
    const { id, name, email, photos } = profile
    const login = name.givenName && name.familyName ? `${name.givenName} ${name.familyName}`
      : name.givenName ? name.givenName : email
    const user: UserFromSocialMedia = {
      provider: PROVIDER_TYPE.GOOGLE,
      provider_id: id,
      email,
      login,
      image: photos[0].value,
    }
    
    done(null, user)
  }
}
