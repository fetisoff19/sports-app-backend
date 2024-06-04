import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from '@/decorators'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { ConfigService } from '@nestjs/config'
import { CustomError } from '@/custom-error'
import { UserService } from '@/microservice/user/user.service'
import { Payload } from '@/common/types'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(Reflector) private readonly reflector: Reflector,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()],
      )
      if (isPublic) {
        return true
      }
      const request = context.switchToHttp().getRequest()
      const token = this.extractTokenFromHeader(request)
      const payload: Payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: this.config.get<string>('secret'),
        },
      )
      const user = await  this.userService.findByUuid(payload.uuid)
      if(!user) {
        throw new CustomError(401, 'Auth error')
      }
      request.user = user
      return true
    } catch (e) {
      throw new CustomError(401, 'Auth error')
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
