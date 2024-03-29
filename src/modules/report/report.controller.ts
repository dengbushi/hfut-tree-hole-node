import { Body, Controller, Inject, Patch, Post, Req } from '@nestjs/common'
import { Request } from 'express'
import { ApiTags } from '@nestjs/swagger'
import { ReportCommentDto, ReportHoleDto } from './dto/report.dto'
import { ReportService } from './report.service'
import { Roles } from '@/common/decorators/roles.decorator'
import { Police } from '@/common/guards/policies.guard'
import { ReportTypes } from '@/schema/report/report.schema'

@ApiTags('举报模块')
@Roles()
@Police()
@Controller('report')
export class ReportController {
  @Inject()
  private readonly reportService: ReportService

  @Post('hole')
  async reportHole(@Req() req: Request, @Body() dto: ReportHoleDto) {
    return this.reportService.report(dto, req.user, ReportTypes.HOLE)
  }

  @Patch('hole')
  async patchHole(@Req() req: Request, @Body() dto: ReportHoleDto) {
    return this.reportService.patch(dto, req.user, ReportTypes.HOLE)
  }

  @Post('comment')
  async reportComment(@Req() req: Request, @Body() dto: ReportCommentDto) {
    return this.reportService.report(dto, req.user, ReportTypes.COMMENT)
  }

  @Patch('comment')
  async patchComment(@Req() req: Request, @Body() dto: ReportCommentDto) {
    return this.reportService.patch(dto, req.user, ReportTypes.COMMENT)
  }
}
