import { Controller, Get, Inject, Post, Req } from '@nestjs/common'
import { Roles } from '@/common/decorators/roles.decorator'
import { Request } from 'express'
import { NotifyService } from '@/modules/notify/notify.service'

@Roles()
@Controller('notify')
export class NotifyController {
  @Inject()
  private readonly notifyService: NotifyService

  @Get('unread')
  getUnread(@Req() req: Request) {}

  @Post('add')
  addUnread(@Req() req: Request) {}

  @Post('read')
  read(@Req() req: Request) {}
}
