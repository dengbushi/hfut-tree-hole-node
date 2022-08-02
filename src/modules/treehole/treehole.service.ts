import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { isEmpty } from 'lodash'
import { createResponse } from '../../shared/utils/create'
import { Holes, HolesDocument } from '../../schema/treehole/holes.schema'
import { ITokenData } from '../auth/guard/type'
import { TreeholeDaoService } from '../../dao/treehole-dao.service'
import { CreateHoleDto, TreeholeDetailDto, TreeholeListDto } from './dto/treehole.dto'

@Injectable()
export class TreeholeService {
  @InjectModel(Holes.name)
  private readonly holesModel: Model<HolesDocument>

  @Inject()
  private readonly treeholeDaoService: TreeholeDaoService

  async getModes() {
    const modes = await this.holesModel.findOne({}, { _id: 0, __v: 0 })

    if (isEmpty(modes)) {
      throw new NotFoundException('未查询到树洞浏览模式')
    }

    return createResponse('获取树洞模式成功', modes)
  }

  async getList(dto: TreeholeListDto) {
    const holes = await this.treeholeDaoService.getList(dto)

    return createResponse('获取树洞列表成功', holes)
  }

  async getDetail(dto: TreeholeDetailDto) {
    return createResponse('',
      {
        content: 'Hello World!',
        id: '1',
        createTime: '22/07/01',
        commentsNum: 464,
        stars: 361,
        comments: [
          { avatar: '', isHost: true, content: 'Hello World!', createTime: '22/07/01 18:06:53', username: 'Alice', reply: [] },
          {
            avatar: '',
            isHost: false,
            content: '打卡',
            createTime: '22/07/01 18:09:54',
            username: 'Bob',
            reply: [],
          },
        ],
        imgs: [],
      })
  }

  async createHole(dto: CreateHoleDto, user: ITokenData) {
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
}
