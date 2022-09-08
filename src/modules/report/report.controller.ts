import { Body, Controller, Inject, Post } from '@nestjs/common'
import { Roles } from '../../common/decorators/roles.decorator'
import { IsValidHoleIdDto } from '../treehole/dto/utils'
import { ReportService } from './report.service'

@Controller('report')
@Roles()
export class ReportController {
  @Inject()
  private readonly reportService: ReportService

  @Post('hole')
  async reportHole(@Body() dto: IsValidHoleIdDto) {
    return this.reportService.reportHole(dto)
  }
}
