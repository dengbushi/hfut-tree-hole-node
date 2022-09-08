import { Body, Controller, Delete, Get, Inject, Post, Query, Req } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { Roles } from '../../common/decorators/roles.decorator'
import { Police } from '../../common/guards/policies.guard'
import { TreeholeDaoService } from '../../dao/treehole/treehole-dao.service'
import { CheckPolicies } from '../../common/decorators/CheckPolicies.decorator'
import { TreeholeService } from './treehole.service'
import {
  CreateCommentDto,
  CreateHoleDto,
  RemoveHoleCommentDto,
  StarHoleDto,
  TreeholeDetailDto,
  TreeholeListDto,
} from './dto/treehole.dto'
import { ModeService } from './mode.service'
import { IsValidHoleIdDto } from './dto/utils'
import { DeleteHolePolicyHandler } from './policies/delete.police'

@ApiTags('树洞模块')
@ApiBearerAuth()
@Police()
@Roles()
@Controller('treehole')
export class TreeholeController {
  @Inject()
  private readonly treeholeService: TreeholeService

  @Inject()
  private readonly modeService: ModeService

  @Inject()
  private readonly treeholeDaoService: TreeholeDaoService

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

  @Post('reportHole')
  async reportHole(@Body() dto: IsValidHoleIdDto) {
    return this.treeholeService.reportHole(dto)
  }

  @Post('create')
  async createHole(
    @Body() dto: CreateHoleDto,
    @Req() req: Request,
  ) {
    return this.treeholeService.createHole(dto, req.user)
  }

  @CheckPolicies(new DeleteHolePolicyHandler())
  @Delete('remove')
  async removeHole(
    @Body() dto: IsValidHoleIdDto,
    @Req() req: Request,
  ) {
    return this.treeholeService.removeHole(dto, req.user)
  }

  @Post('comment')
  async createComment(@Body() dto: CreateCommentDto, @Req() req: Request) {
    return this.treeholeService.createComment(dto, req.user)
  }

  @CheckPolicies()
  @Delete('comment')
  async removeComment(
    @Body() dto: RemoveHoleCommentDto,
    @Req() req: Request,
  ) {
    return this.treeholeService.removeComment(dto, req.user)
  }

  @Post('star')
  async starHole(@Body() dto: StarHoleDto, @Req() req: Request) {
    return this.treeholeService.starHole(dto, req.user)
  }

  @Delete('star')
  async removeStar(@Body() dto: StarHoleDto, @Req() req: Request) {
    return this.treeholeService.removeStar(dto, req.user)
  }
}
