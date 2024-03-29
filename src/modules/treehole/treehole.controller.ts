import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import {
  DeleteCommentPolicyHandler,
  DeleteHolePolicyHandler,
} from './policies/delete.police'
import { TreeholeService } from './treehole.service'
import {
  CreateCommentDto,
  CreateHoleDto,
  RemoveHoleCommentDto,
  ReplyCommentDto,
  StarHoleDto,
  TreeholeDetailDto,
  TreeholeListDto,
} from './dto/treehole.dto'
import { ModeService } from './mode.service'
import { IsValidHoleIdDto } from './dto/utils'
import { HoleSearchDto } from './dto/search.dto'
import { CheckPolicies } from '@/common/decorators/CheckPolicies.decorator'
import { TreeholeDaoService } from '@/dao/treehole/treehole-dao.service'
import { Roles } from '@/common/decorators/roles.decorator'
import { Police } from '@/common/guards/policies.guard'
import { CreateHolePolicyHandler } from '@/modules/treehole/policies/create.police'
import { HolePostLimitGuard } from '@/common/guards/hole.guard'

@ApiTags('树洞模块')
@ApiBearerAuth()
@Roles()
@Police()
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

  @Get('detail/comment')
  async getComment(@Query() dto: IsValidHoleIdDto, @Req() req: Request) {}

  @Get('search')
  async searchHole(@Query() dto: HoleSearchDto) {
    return this.treeholeService.search(dto)
  }

  @CheckPolicies(CreateHolePolicyHandler)
  @UseGuards(HolePostLimitGuard)
  @Post('create')
  async createHole(@Body() dto: CreateHoleDto, @Req() req: Request) {
    return this.treeholeService.createHole(dto, req.user)
  }

  @CheckPolicies(DeleteHolePolicyHandler)
  @Delete('remove')
  async removeHole(@Body() dto: IsValidHoleIdDto, @Req() req: Request) {
    return this.treeholeService.removeHole(dto)
  }

  @Post('comment')
  async createComment(@Body() dto: CreateCommentDto, @Req() req: Request) {
    return this.treeholeService.createComment(dto, req.user)
  }

  @Post('comment/reply')
  async replyComment(@Body() dto: ReplyCommentDto, @Req() req: Request) {
    return this.treeholeService.replyComment(dto, req.user)
  }

  @CheckPolicies(DeleteCommentPolicyHandler)
  @Delete('comment')
  async removeComment(@Body() dto: RemoveHoleCommentDto, @Req() req: Request) {
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
