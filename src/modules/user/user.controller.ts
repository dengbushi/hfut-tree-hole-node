import { Controller, Get, Inject, Req } from '@nestjs/common'
import { Request } from 'express'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  @Inject()
  private readonly userService: UserService

  @Get('getUserInfo')
  getUserInfo(@Req() req: Request) {
    return this.userService.getUserInfo(req.user)
  }
}
