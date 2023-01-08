import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
  LoggerService,
  NotFoundException,
} from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import type { HoleDetailDocument } from 'src/schema/treehole/holeDetail.schema'
import { InjectRedis } from '@liaoliaots/nestjs-redis'
import Redis from 'ioredis'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import type { Cache } from 'cache-manager'
import { CaslAbilityFactory } from '../casl/casl.factory'
import { Role } from '../role/role.enum'
import {
  CreateCommentDto,
  CreateHoleDto,
  RemoveHoleCommentDto,
  ReplyCommentDto,
  StarHoleDto,
  TreeholeDetailDto,
  TreeholeListDto,
} from './dto/treehole.dto'
import { IsValidHoleIdDto } from './dto/utils'
import { HoleSearchDto } from './dto/search.dto'
import { HoleDetail } from '@/schema/treehole/holeDetail.schema'
import { IUser } from '@/env'
import { TreeholeDaoService } from '@/dao/treehole/treehole-dao.service'
import { Holes, HolesDocument } from '@/schema/treehole/holes.schema'
import { createMongoId, createResponse } from '@/shared/utils/create'
import { HolesCount, HolesCountDocument } from '@/schema/treehole/count.schema'

@Injectable()
export class TreeholeService {
  @InjectModel(Holes.name)
  private readonly holesModel: Model<HolesDocument>

  @Inject()
  private readonly treeholeDaoService: TreeholeDaoService

  @InjectModel(HoleDetail.name)
  private readonly holeDetailModel: Model<HoleDetailDocument>

  @InjectModel(HolesCount.name)
  private readonly holesCountModel: Model<HolesCountDocument>

  @Inject()
  private readonly caslFacotry: CaslAbilityFactory

  @Inject(WINSTON_MODULE_NEST_PROVIDER)
  private readonly logger: LoggerService

  @Inject(CACHE_MANAGER)
  private cacheManager: Cache

  constructor(
    @InjectRedis()
    private readonly redis: Redis,
    @InjectConnection()
    private readonly connection: mongoose.Connection
  ) {}

  async getList(dto: TreeholeListDto, user: IUser) {
    const holes = await this.treeholeDaoService.getList(dto, user.studentId)

    return createResponse('获取树洞列表成功', holes)
  }

  async getDetail(dto: TreeholeDetailDto, user: IUser) {
    try {
      const res = await this.treeholeDaoService.getDetail(
        dto.id,
        user.studentId
      )

      return createResponse('获取树洞详情成功', res)
    } catch (err) {
      this.logger.error(err.stack.toString())
      throw new InternalServerErrorException('获取树洞详情失败')
    }
  }

  async createHole(dto: CreateHoleDto, user: IUser) {
    const transactionSession = await this.connection.startSession()
    let generatedId: number
    try {
      await transactionSession.withTransaction(async () => {
        const id = (await this.holesCountModel.findOne()).count + 1
        const hole = await new this.holesModel({
          userId: user.studentId,
          ...dto,
          id,
          stars: 0,
          options: dto.options
            ? dto.options.map((item) => ({ option: item, voteNum: 0 }))
            : [],
        }).save({ session: transactionSession })

        await this.holesCountModel.updateOne(
          {},
          { $inc: { count: 1 } },
          { session: transactionSession }
        )

        generatedId = hole.id
      })
    } catch (err) {
      this.logger.error(err.stack.toString())
      throw new InternalServerErrorException('创建树洞失败')
    }

    return createResponse('创建树洞成功', { id: generatedId })
  }

  async removeHole(dto: IsValidHoleIdDto) {
    const transactionSession = await this.connection.startSession()

    // TODO 解决事务问题
    try {
      await transactionSession.withTransaction(async () => {
        const hole = await this.holesModel.findOne({ id: dto.id })

        await this.holesModel.deleteOne(
          { id: dto.id },
          { session: transactionSession }
        )

        await this.holesCountModel.updateOne(
          {},
          {
            $push: {
              removedList: hole.toJSON() as Holes,
            },
          },
          { session: transactionSession }
        )
      })
    } catch (err) {
      this.logger.error(err.stack.toString())
      throw new InternalServerErrorException('删除树洞失败')
    } finally {
      await transactionSession.endSession()
    }

    return createResponse('删除成功')
  }

  async createComment(dto: CreateCommentDto | ReplyCommentDto, user: IUser) {
    try {
      const id = new mongoose.Types.ObjectId()
      const isReply = !!(dto as ReplyCommentDto).commentId

      await this.holesModel.updateOne(
        { id: dto.id },
        {
          $push: {
            comments: {
              _id: id,
              userId: user.studentId,
              content: dto.content,
              createTime: new Date(),
              replyTo: isReply
                ? createMongoId((dto as ReplyCommentDto).commentId)
                : null,
              parentId: isReply
                ? createMongoId((dto as ReplyCommentDto).commentId)
                : null,
            },
          },
        }
      )

      return createResponse('留言成功', { commentId: id })
    } catch (err) {
      throw new InternalServerErrorException('留言失败')
    }
  }

  async replyComment(dto: CreateCommentDto, user: IUser) {
    return this.createComment(dto, user)
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

    const comment = isCommentExist.comments.find((item) =>
      commentId.equals(item._id)
    )

    if (comment.userId !== user.studentId && !user.roles.includes(Role.Admin)) {
      throw new BadRequestException('不能删除其他人的评论')
    }

    try {
      await this.holesModel.updateOne(
        { id: dto.id },
        {
          $pull: {
            comments: { _id: commentId },
          },
        }
      )

      return createResponse('删除评论成功')
    } catch (err) {
      throw new InternalServerErrorException('删除评论失败')
    }
  }

  async starHole(dto: StarHoleDto, user: IUser) {
    const hole = await this.holesModel.findOne({ id: dto.id })

    const isStared = hole.starUserIds.includes(user.studentId)

    if (isStared) {
      throw new BadRequestException('你已经star过该树洞啦~')
    }

    try {
      await this.holesModel.updateOne(
        { id: dto.id },
        {
          $inc: { stars: 1 },
          $push: {
            starUserIds: user.studentId as any,
          },
        }
      )

      return createResponse('点赞树洞成功')
    } catch (err) {
      throw new InternalServerErrorException('树洞点赞失败')
    }
  }

  async removeStar(dto: StarHoleDto, user: IUser) {
    const hole = await this.treeholeDaoService.findById(dto.id)

    const isStared = hole.starUserIds.includes(user.studentId)

    if (!isStared) {
      throw new BadRequestException('你还没有star该树洞哦~')
    }

    try {
      await this.holesModel.updateOne(
        { id: dto.id },
        {
          $pull: {
            starUserIds: user.studentId as any,
          },
        }
      )

      return createResponse('删除成功')
    } catch (err) {
      throw new InternalServerErrorException('star删除失败')
    }
  }

  async search(dto: HoleSearchDto) {}
}
