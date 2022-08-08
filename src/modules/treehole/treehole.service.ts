import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { createResponse } from '../../shared/utils/create'
import { Holes, HolesDocument } from '../../schema/treehole/holes.schema'
import { TreeholeDaoService } from '../../dao/treehole/treehole-dao.service'
import { IUser } from '../../env'
import { CreateCommentDto, CreateHoleDto, StarHoleDto, TreeholeDetailDto, TreeholeListDto } from './dto/treehole.dto'

@Injectable()
export class TreeholeService {
  @InjectModel(Holes.name)
  private readonly holesModel: Model<HolesDocument>

  @Inject()
  private readonly treeholeDaoService: TreeholeDaoService

  async getList(dto: TreeholeListDto) {
    const holes = await this.treeholeDaoService.getList(dto)

    return createResponse('获取树洞列表成功', holes)
  }

  async getDetail(dto: TreeholeDetailDto) {
    try {
      const res = await this.treeholeDaoService.getDetail(dto.id)
      return createResponse('获取树洞详情成功', res)
    } catch (err) {
      throw new InternalServerErrorException('获取树洞详情失败')
    }
  }

  async createHole(dto: CreateHoleDto, user: IUser) {
    try {
      const hole = await new this.holesModel({
        userId: user.studentId,
        ...dto,
        stars: Number(Math.random() * 1000).toFixed(0),
      }).save()

      return createResponse('创建树洞成功', { _id: hole._id })
    } catch (err) {
      throw new InternalServerErrorException('创建树洞失败')
    }
  }

  async createComment(dto: CreateCommentDto, user: IUser) {
    await this.treeholeDaoService.createComment(dto, user)

    return createResponse('留言成功', {})
  }

  async starHole(dto: StarHoleDto, user: IUser) {
    try {
      await this.holesModel.updateOne({ _id: dto.id }, {
        $inc: { stars: 1 },
      })

      return createResponse('点赞树洞成功')
    } catch (err) {
      throw new InternalServerErrorException('树洞点赞失败')
    }
  }
}
