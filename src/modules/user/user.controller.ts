import { Controller, Get, Inject, Request } from '@nestjs/common'
import { IRequestHeaderUserData } from '../auth/guard/type'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  @Inject()
  private readonly userService: UserService

  @Get('getUserInfo')
  getUserInfo(@Request() req: IRequestHeaderUserData) {
    return this.userService.getUserInfo(req.user)
  }
}
