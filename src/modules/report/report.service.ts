import { BadRequestException, CACHE_MANAGER, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import Mongoose, { Model } from 'mongoose'
import { Cache } from 'cache-manager'
import { ReportCommentDto, ReportHoleDto } from './dto/report.dto'
import { Report, ReportDocument, ReportTypes } from '@/schema/report/report.schema'
import { Holes, HolesDocument } from '@/schema/treehole/holes.schema'
import { createResponse } from '@/shared/utils/create'
import { IUser } from '@/env'
import { TreeholeDaoService } from '@/dao/treehole/treehole-dao.service'
import { cacheKey } from '@/shared/constant/cacheKeys'

@Injectable()
export class ReportService {
  @InjectModel(Report.name)
  private readonly reportModel: Model<ReportDocument>

  @InjectModel(Holes.name)
  private readonly holesModel: Model<HolesDocument>

  @Inject(CACHE_MANAGER)
  private cacheManager: Cache

  @Inject()
  private readonly treeholeDaoService: TreeholeDaoService

  async report(dto: ReportHoleDto | ReportCommentDto, user: IUser, key: string) {
    const { isReportExist, id, type } = await this.preloadData(dto, user, key)

    if (isReportExist) {
      if (!isReportExist.reportUsers.some(item => item.id === user.studentId)) {
        await this.reportModel.updateOne({
          id,
          type,
        },
        { $push: { reportUsers: { id: user.studentId, msg: dto.msg } } },
        )
      } else {
        throw new BadRequestException('你已经举报过啦')
      }
    } else {
      const report = await this.reportModel.create({ id, type, reportUsers: [{ id: user.studentId, msg: dto.msg }] })
      report.save()
    }

    await this.cacheManager.del(cacheKey.Hole)

    return createResponse('举报成功')
  }

  async patch(dto: ReportHoleDto | ReportCommentDto, user: IUser, key: string) {
    const { isReportExist, id } = await this.preloadData(dto, user, key)

    if (!isReportExist) {
      throw new NotFoundException('该举报不存在')
    }

    const report = isReportExist.reportUsers.find(item => item.id === user.studentId)

    if (report?.id !== user.studentId) {
      throw new BadRequestException('你不能修改其他人的举报')
    }

    await this.reportModel.updateOne({
      id,
      reportUsers: {
        $elemMatch: { id: user.studentId },
      },
    },
    { $set: { 'reportUsers.$.msg': dto.msg } })

    await this.cacheManager.del(cacheKey.Hole)

    return createResponse('修改举报评论成功')
  }

  async preloadData(dto: ReportHoleDto | ReportCommentDto, user: IUser, key: string) {
    const cache = await this.cacheManager.get(key) as any
    const id = cache._id as Mongoose.Types.ObjectId

    let type: ReportTypes

    switch (key) {
      case cacheKey.Hole:
        type = ReportTypes.HOLE
        break
      case cacheKey.HoleComment:
        type = ReportTypes.COMMENT
        break
    }

    const isReportExist = await this.reportModel.findOne({ id })

    return {
      id,
      type,
      isReportExist,
    }
  }
}
