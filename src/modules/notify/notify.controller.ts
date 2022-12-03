import { Controller } from '@nestjs/common'
import { Roles } from '@/common/decorators/roles.decorator'
import { Role } from '@/modules/role/role.enum'

@Roles([Role.Admin])
@Controller('notify')
export class NotifyController {}
