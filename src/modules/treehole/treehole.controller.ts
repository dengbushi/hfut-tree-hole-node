import { Body, Controller, Get, Inject, Post, Query, Req } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { TreeholeService } from './treehole.service'
import { CreateCommentDto, CreateHoleDto, TreeholeDetailDto, TreeholeListDto } from './dto/treehole.dto'
import { ModeService } from './mode.service'

@ApiTags('树洞模块')
@ApiBearerAuth()
@Controller('treehole')
export class TreeholeController {
  @Inject()
  private readonly treeholeService: TreeholeService

  @Inject()
  private readonly modeService: ModeService

  @Get('modes')
  async getModes() {
    console.log(1)
    return this.modeService.getModes()
  }

  @Get('list')
  async getList(@Query() dto: TreeholeListDto) {
    return this.treeholeService.getList(dto)
  }

  @Get('detail')
  async getDetail(@Query() dto: TreeholeDetailDto) {
    return this.treeholeService.getDetail(dto)
  }

  @Post('create')
  async createHole(
    @Body() dto: CreateHoleDto,
    @Req() req: Request,
  ) {
    return this.treeholeService.createHole(dto, req.user)
  }

  @Post('comment')
  async createComment(@Body() dto: CreateCommentDto, @Req() req: Request) {
    return this.treeholeService.createComment(dto, req.user)
  }
}
