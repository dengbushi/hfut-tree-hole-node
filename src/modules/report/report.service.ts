import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import Mongoose, { Model } from 'mongoose'
import { ReportCommentDto, ReportHoleDto } from './dto/report.dto'
import {
  Report,
  ReportDocument,
  ReportTypes,
} from '@/schema/report/report.schema'
import { Holes, HolesDocument } from '@/schema/treehole/holes.schema'
import { createResponse } from '@/shared/utils/create'
import { IUser } from '@/env'
import { TreeholeDaoService } from '@/dao/treehole/treehole-dao.service'

@Injectable()
export class ReportService {
  @InjectModel(Report.name)
  private readonly reportModel: Model<ReportDocument>

  @InjectModel(Holes.name)
  private readonly holesModel: Model<HolesDocument>

  @Inject()
  private readonly treeholeDaoService: TreeholeDaoService

  async report(
    dto: ReportHoleDto | ReportCommentDto,
    user: IUser,
    type: ReportTypes
  ) {
    const { isReportExist, id } = await this.preloadData(dto, user, type)

    if (isReportExist) {
      if (
        !isReportExist.reportUsers.some((item) => item.id === user.studentId)
      ) {
        await this.reportModel.updateOne(
          {
            id,
            type,
          },
          { $push: { reportUsers: { id: user.studentId, msg: dto.msg } } }
        )
      } else {
        throw new BadRequestException('你已经举报过啦')
      }
    } else {
      const report = await this.reportModel.create({
        id,
        type,
        reportUsers: [{ id: user.studentId, msg: dto.msg }],
      })
      report.save()
    }

    return createResponse('举报成功')
  }

  async patch(
    dto: ReportHoleDto | ReportCommentDto,
    user: IUser,
    type: ReportTypes
  ) {
    const { isReportExist, id } = await this.preloadData(dto, user, type)

    if (!isReportExist) {
      throw new NotFoundException('该举报不存在')
    }

    const report = isReportExist.reportUsers.find(
      (item) => item.id === user.studentId
    )

    if (report?.id !== user.studentId) {
      throw new BadRequestException('你不能修改其他人的举报')
    }

    await this.reportModel.updateOne(
      {
        id,
        reportUsers: {
          $elemMatch: { id: user.studentId },
        },
      },
      { $set: { 'reportUsers.$.msg': dto.msg } }
    )

    return createResponse('修改举报评论成功')
  }

  async preloadData(
    dto: ReportHoleDto | ReportCommentDto,
    user: IUser,
    type: ReportTypes
  ) {
    let id: Mongoose.Types.ObjectId

    if (type === ReportTypes.HOLE) {
      id = await this.holesModel.findOne({
        id: dto.id,
      })
    } else {
      id = (
        await this.holesModel.findOne({
          comments: {
            $elemMatch: { _id: dto.id },
          },
        })
      )._id
    }

    const isReportExist = await this.reportModel.findOne({})

    return {
      id,
      isReportExist,
    }
  }
}
