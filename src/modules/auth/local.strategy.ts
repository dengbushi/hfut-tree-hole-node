import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginQueryDto } from './dto/loginQuery.dto'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  @Inject()
  private readonly authService: AuthService

  constructor() {
    super({
      usernameField: 'studentId',
    })
  }

  // 验证是否是第一次登录
  async validate(dto: LoginQueryDto) {
    const user = await this.authService.isUserExist(dto)
    if (!user) {
      throw new UnauthorizedException('用户未注册')
    }
    return user
  }
}
