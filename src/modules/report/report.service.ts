import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { IsValidHoleIdDto } from '../treehole/dto/utils'
import { Report, ReportDocument, ReportTypes } from '../../schema/report/report.schema'
import { Holes, HolesDocument } from '../../schema/treehole/holes.schema'

@Injectable()
export class ReportService {
  @InjectModel(Report.name)
  private readonly reportModel: Model<ReportDocument>

  @InjectModel(Holes.name)
  private readonly HolesModel: Model<HolesDocument>

  async reportHole(dto: IsValidHoleIdDto) {
    // TODO get the hole data from the redis which will be processed

    const isExist = await this.reportModel.findOne({ id: dto.id, type: ReportTypes.HOLE })

    console.log(isExist)
  }
}
