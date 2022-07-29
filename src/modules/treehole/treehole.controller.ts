import { Controller, Get, Inject, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { TreeholeService } from './treehole.service'
import { TreeholeDetailDto, TreeholeListDto } from './dto/treehole.dto'

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
}
