import { Controller, Get, Inject, Request } from '@nestjs/common'
import { RequestHeaderUserInfo } from '../auth/guard/type'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  @Inject()
  private readonly userService: UserService

  @Get('getUserInfo')
  getUserInfo(@Request() req: RequestHeaderUserInfo) {
    return this.userService.getUserInfo(req.user)
  }
}
