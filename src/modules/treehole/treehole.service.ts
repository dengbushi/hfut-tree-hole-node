import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { createResponse } from '../../shared/utils/create'
import { Holes, HolesDocument } from '../../schema/treehole/holes.schema'
import { TreeholeDaoService } from '../../dao/treehole/treehole-dao.service'
import { IUser } from '../../env'
import { CaslAbilityFactory } from '../casl/casl.factory'
import { Role } from '../role/role.enum'
import {
  CreateCommentDto,
  CreateHoleDto,
  RemoveHoleCommentDto,
  StarHoleDto,
  TreeholeDetailDto,
  TreeholeListDto,
} from './dto/treehole.dto'
import { IsValidHoleIdDto } from './dto/utils'

@Injectable()
export class TreeholeService {
  @InjectModel(Holes.name)
  private readonly holesModel: Model<HolesDocument>

  @Inject()
  private readonly treeholeDaoService: TreeholeDaoService

  @Inject()
  private readonly caslFacotry: CaslAbilityFactory

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

  async removeHole(dto: IsValidHoleIdDto, user: IUser) {
    try {
      await this.holesModel.deleteOne({ _id: new mongoose.Types.ObjectId(dto.id) })

      return createResponse('删除成功')
    } catch (err) {
      throw new InternalServerErrorException('删除树洞失败')
    }
  }

  async createComment(dto: CreateCommentDto, user: IUser) {
    try {
      const id = new mongoose.Types.ObjectId()
      await this.holesModel.updateOne({ _id: dto.id }, {
        $push: {
          comments: {
            _id: id,
            userId: user.studentId,
            content: dto.content,
            createTime: new Date(),
          },
        },
      })

      return createResponse('留言成功', { commentId: id })
    } catch (err) {
      throw new InternalServerErrorException('留言失败')
    }
  }

  async removeComment(dto: RemoveHoleCommentDto, user: IUser) {
    const commentId = new mongoose.Types.ObjectId(dto.commentId)

    const isCommentExist = await this.holesModel.findOne({
      comments: {
        $elemMatch: { _id: commentId },
      },
    })

    if (!isCommentExist) {
      throw new NotFoundException('评论不存在')
    }

    const comment = isCommentExist.comments.find(item => commentId.equals(item._id))

    if (comment.userId !== user.studentId && !user.roles.includes(Role.Admin)) {
      throw new BadRequestException('不能删除其他人的评论')
    }

    try {
      await this.holesModel.updateOne({ _id: dto.id }, {
        $pull: {
          comments: { _id: commentId },
        },
      })

      return createResponse('删除评论成功')
    } catch (err) {
      throw new InternalServerErrorException('删除评论失败')
    }
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
      await this.holesModel.updateOne({ _id: new mongoose.Types.ObjectId(dto.id) }, {
        $pull: {
          starUserIds: user.studentId as any,
        },
      })

      return createResponse('删除成功')
    } catch (err) {
      throw new InternalServerErrorException('star删除失败')
    }
  }

  async findHole(id: string) {
    const article = await this.treeholeDaoService.findById(id)
    return new Holes({
      userId: article.userId,
    })
  }
}
