import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import Mongoose, { Model } from 'mongoose'
import { createResponse } from '../../shared/utils/create'
import { Holes, HolesDocument } from '../../schema/treehole/holes.schema'
import { TreeholeDaoService } from '../../dao/treehole/treehole-dao.service'
import { IUser } from '../../env'
import { Action } from '../../common/enums/action.enum'
import { CreateCommentDto, CreateHoleDto, StarHoleDto, TreeholeDetailDto, TreeholeListDto } from './dto/treehole.dto'
import { IsValidIdDto } from './dto/utils'
import { CaslAbilityFactory } from './casl.factory'

@Injectable()
export class TreeholeService {
  @InjectModel(Holes.name)
  private readonly holesModel: Model<HolesDocument>

  @Inject()
  private readonly treeholeDaoService: TreeholeDaoService

  @Inject()
  private readonly caslFactory: CaslAbilityFactory

  async getList(dto: TreeholeListDto, user: IUser) {
    const holes = await this.treeholeDaoService.getList(dto, user.studentId)

    return createResponse('获取树洞列表成功', holes)
  }

  async getDetail(dto: TreeholeDetailDto, user: IUser) {
    try {
      const res = await this.treeholeDaoService.getDetail(dto.id, user.studentId)

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

  async removeHole(dto: IsValidIdDto, user: IUser) {
    const hole = await this.findHole(dto.id)
    const ability = await this.caslFactory.createForUser(user)

    if (!ability.can(Action.Delete, hole)) {
      throw new UnauthorizedException('权限不足')
    }

    try {
      await this.holesModel.remove({ _id: new Mongoose.Types.ObjectId(dto.id) })

      return createResponse('删除成功')
    } catch (err) {
      throw new InternalServerErrorException('删除树洞失败')
    }
  }

  async createComment(dto: CreateCommentDto, user: IUser) {
    await this.treeholeDaoService.createComment(dto, user)

    return createResponse('留言成功', {})
  }

  async starHole(dto: StarHoleDto, user: IUser) {
    const isStared = (await this.holesModel.findById(dto.id)).starUserIds.includes(user.studentId)

    if (isStared) {
      throw new BadRequestException('树洞star重复')
    }

    try {
      await this.holesModel.updateOne({ _id: dto.id }, {
        $inc: { stars: 1 },
        $push: {
          starUserIds: user.studentId as any,
        },
      })

      return createResponse('点赞树洞成功')
    } catch (err) {
      throw new InternalServerErrorException('树洞点赞失败')
    }
  }

  async removeStar(dto: StarHoleDto, user: IUser) {
    const isStared = (await this.holesModel.findById(dto.id)).starUserIds.includes(user.studentId)

    if (!isStared) {
      throw new BadRequestException('不能删除不存在的star')
    }

    try {
      await this.holesModel.updateOne({ _id: new Mongoose.Types.ObjectId(dto.id) }, {
        $pull: {
          starUserIds: user.studentId as any,
        },
      })

      return createResponse('删除成功')
    } catch (err) {
      throw new InternalServerErrorException('树洞点赞删除失败')
    }
  }

  async findHole(id: string) {
    const article = await this.treeholeDaoService.findById(id)
    const hole = new Holes({
      userId: article.userId,
    })

    return hole
  }
}
