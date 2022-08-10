import { Controller, Get, Inject, Req } from '@nestjs/common'
import { Request } from 'express'
import { ApiTags } from '@nestjs/swagger'
import { Roles } from '../../common/decorators/roles.decorator'
import { Role } from '../role/role.enum'
import { UserService } from './user.service'

@ApiTags('用户模块')
@Controller('user')
@Roles([Role.Banned, Role.User, Role.Admin])
export class UserController {
  @Inject()
  private readonly userService: UserService

  @Get('getUserInfo')
  getUserInfo(@Req() req: Request) {
    return this.userService.getUserInfo(req.user)
  }
}
