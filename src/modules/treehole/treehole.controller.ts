import { Body, Controller, Get, Inject, Post, Query, Req } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { IRequestHeaderUserData } from '../auth/guard/type'
import { TreeholeService } from './treehole.service'
import { CreateHoleDto, TreeholeDetailDto, TreeholeListDto } from './dto/treehole.dto'

@ApiTags('树洞模块')
@ApiBearerAuth()
@Controller('treehole')
export class TreeholeController {
  @Inject()
  private readonly treeholeService: TreeholeService

  @Get('modes')
  async getModes() {
    return this.treeholeService.getModes()
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
  async createHole(@Body() dto: CreateHoleDto, @Req() req: IRequestHeaderUserData) {
    return this.treeholeService.createHole(dto, req.user)
  }
}
