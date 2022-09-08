import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Report, ReportSchema } from '../../schema/report/report.schema'
import { Holes, HolesSchema } from '../../schema/treehole/holes.schema'
import { ReportController } from './report.controller'
import { ReportService } from './report.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Report.name, schema: ReportSchema },
      { name: Holes.name, schema: HolesSchema },
    ]),
  ],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
