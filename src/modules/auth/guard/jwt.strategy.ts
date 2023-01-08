import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Inject, Injectable, NotAcceptableException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { UserService } from '@/modules/user/user.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  @Inject()
  private readonly userService: UserService

  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    })
  }

  async validate(payload: { studentId: number }) {
    const { studentId } = payload

    const user = this.userService.findOne(studentId)

    if (!user) {
      throw new NotAcceptableException()
    }

    return payload
  }
}
