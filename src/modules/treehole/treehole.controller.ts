import { Controller, Get, Inject, Query } from '@nestjs/common'
import { TreeholeService } from './treehole.service'
import { TreeholeListDto } from './dto/treehole.dto'

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
    return this.treeholeService.getList()
  }
}
