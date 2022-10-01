import { Body, Controller, Get, Inject, Post, Req } from '@nestjs/common'
import { Request } from 'express'
import { ApiTags } from '@nestjs/swagger'
import { UserService } from './user.service'
import { UpdateDto } from './dto/update.dto'
import { Roles } from '@/common/decorators/roles.decorator'

@ApiTags('用户模块')
@Controller('user')
@Roles()
export class UserController {
  @Inject()
  private readonly userService: UserService

  @Get('getUserInfo')
  async getUserInfo(@Req() req: Request) {
    return this.userService.getUserInfo(req.user)
  }

  @Get('holes')
  async getHolesList(@Req() req: Request) {
    return this.userService.getHoles(req.user)
  }

  @Get('holes/star')
  async getHolesLike(@Req() req: Request) {
    return this.userService.getHolesStar(req.user)
  }

  @Post('update')
  async update(
    @Req() req: Request,
    @Body() dto: UpdateDto,
  ) {
    return this.userService.update(dto, req.user)
  }
}
