import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { UserService } from '../user/user.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  @Inject()
  private readonly userService: UserService

  constructor() {
    super({
      usernameField: 'studentId',
      passwordField: 'password',
    })
  }

  // 验证是否是第一次登录
  async validate(studentId: number) {
    const user = await this.userService.findOne(studentId)
    if (!user) {
      throw new NotFoundException('用户未注册')
    }
    return user
  }
}
