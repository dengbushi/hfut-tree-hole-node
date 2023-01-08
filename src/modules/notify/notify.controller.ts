import { Controller, Get } from '@nestjs/common'
import { Roles } from '@/common/decorators/roles.decorator'

@Roles()
@Controller('notify')
export class NotifyController {
  @Get('unread')
  getUnread() {

  }
}
