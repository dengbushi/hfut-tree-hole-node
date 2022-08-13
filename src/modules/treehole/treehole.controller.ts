import { Body, Controller, Get, Inject, Post, Query, Req } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { Roles } from '../../common/decorators/roles.decorator'
import { Role } from '../role/role.enum'
import { Police } from '../../common/guards/policies.guard'
import { CheckPolicies } from '../../common/decorators/CheckPolicies.decorator'
import { CreateHolePolicyHandler } from '../../common/policies/create.police'
import { DeleteHolePolicyHandler } from '../../common/policies/delete.police'
import { TreeholeService } from './treehole.service'
import { CreateCommentDto, CreateHoleDto, StarHoleDto, TreeholeDetailDto, TreeholeListDto } from './dto/treehole.dto'
import { ModeService } from './mode.service'
import { IsValidIdDto } from './dto/utils'

@ApiTags('树洞模块')
@ApiBearerAuth()
@Police()
@Roles([Role.Admin, Role.User])
@Controller('treehole')
export class TreeholeController {
  @Inject()
  private readonly treeholeService: TreeholeService

  @Inject()
  private readonly modeService: ModeService

  @Get('modes')
  async getModes() {
    return this.modeService.getModes()
  }

  @Get('list')
  async getList(@Query() dto: TreeholeListDto, @Req() req: Request) {
    return this.treeholeService.getList(dto, req.user)
  }

  @Get('detail')
  async getDetail(@Query() dto: TreeholeDetailDto, @Req() req: Request) {
    return this.treeholeService.getDetail(dto, req.user)
  }

  @CheckPolicies(CreateHolePolicyHandler)
  @Post('create')
  async createHole(
    @Body() dto: CreateHoleDto,
    @Req() req: Request,
  ) {
    return this.treeholeService.createHole(dto, req.user)
  }

  @CheckPolicies(DeleteHolePolicyHandler)
  @Post('remove')
  async removeHole(
    @Body() dto: IsValidIdDto,
    @Req() req: Request,
  ) {
    return this.treeholeService.removeHole(dto, req.user)
  }

  @Post('comment')
  async createComment(@Body() dto: CreateCommentDto, @Req() req: Request) {
    return this.treeholeService.createComment(dto, req.user)
  }

  @Post('star')
  async starHole(@Body() dto: StarHoleDto, @Req() req: Request) {
    return this.treeholeService.starHole(dto, req.user)
  }

  @Post('removeStar')
  async removeStar(@Body() dto: StarHoleDto, @Req() req: Request) {
    return this.treeholeService.removeStar(dto, req.user)
  }
}
