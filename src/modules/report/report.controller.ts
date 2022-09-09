import { Body, Controller, Inject, Patch, Post, Req } from '@nestjs/common'
import { Request } from 'express'
import { ApiTags } from '@nestjs/swagger'
import { Roles } from '../../common/decorators/roles.decorator'
import { Police } from '../../common/guards/policies.guard'
import { CommentDtoCacheKey, ValidateHoleCacheKey } from '../../shared/constant/cacheKeys'
import { ReportCommentDto, ReportHoleDto } from './dto/report.dto'
import { ReportService } from './report.service'

@ApiTags('举报模块')
@Roles()
@Police()
@Controller('report')
export class ReportController {
  @Inject()
  private readonly reportService: ReportService

  @Post('hole')
  async reportHole(@Req() req: Request, @Body() dto: ReportHoleDto) {
    return this.reportService.report(dto, req.user, ValidateHoleCacheKey)
  }

  @Patch('hole')
  async patchHole(@Req() req: Request, @Body() dto: ReportHoleDto) {
    return this.reportService.patch(dto, req.user, ValidateHoleCacheKey)
  }

  @Post('comment')
  async reportComment(@Req() req: Request, @Body() dto: ReportCommentDto) {
    return this.reportService.report(dto, req.user, CommentDtoCacheKey)
  }

  @Patch('comment')
  async patchComment(@Req() req: Request, @Body() dto: ReportHoleDto) {
    return this.reportService.patch(dto, req.user, CommentDtoCacheKey)
  }
}
