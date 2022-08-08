import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as _ from 'lodash'
import { createResponse } from '../../shared/utils/create'
import { Holes, HolesDocument } from '../../schema/treehole/holes.schema'
import { TreeholeDaoService } from '../../dao/treehole-dao.service'
import { IUser } from '../../env'
import { CreateCommentDto, CreateHoleDto, TreeholeDetailDto, TreeholeListDto } from './dto/treehole.dto'

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
    let res: Holes

    try {
      res = await this.holesModel.findById(dto.id, { 'comments.userId': 0 })
    } catch (err) {
      throw new InternalServerErrorException('获取树洞详情失败')
    }

    if (_.isEmpty(res)) {
      throw new NotFoundException('没有找到这个树洞哦~')
    }

    return createResponse('获取树洞详情成功', res)
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
}
