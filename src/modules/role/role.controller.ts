import { Body, Controller, Inject, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Roles } from '../../common/decorators/roles.decorator'
import { StudentIdDataWithValidateExistDto } from '../auth/dto/studentId.dto'
import { Role } from './role.enum'
import { RoleService } from './role.service'

@ApiTags('角色模块')
@Controller('role')
@Roles([Role.Admin])
export class RoleController {
  @Inject()
  private readonly roleService: RoleService

  @Post('ban')
  async ban(@Body() dto: StudentIdDataWithValidateExistDto) {
    return this.roleService.ban(dto.studentId)
  }

  @Post('liberate')
  async liberate(@Body() dto: StudentIdDataWithValidateExistDto) {
    return this.roleService.liberate(dto.studentId)
  }
}
