import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, PipelineStage } from 'mongoose'
import {
  ITreeholeDetailPipeLineStage,
  ITreeholeListPipeLineStage,
} from './types'
import { isStarHole } from './utils'
import { Holes, HolesDocument } from '@/schema/treehole/holes.schema'
import { TreeholeListDto } from '@/modules/treehole/dto/treehole.dto'
import { unset } from '@/shared/utils/object'

@Injectable()
export class TreeholeDaoService {
  @InjectModel(Holes.name)
  private readonly holesModel: Model<HolesDocument>

  async getList(dto: TreeholeListDto, userId: number) {
    const sort: PipelineStage = {
      $sort: { id: 1 },
    }

    const skip = (dto.page - 1) * dto.limit

    const pipeLineStage: PipelineStage[] = [
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: 'studentId',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $addFields: {
          comments: {
            $mergeObjects: {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              data: { $slice: ['$comments', 0, 2] },
              length: {
                $size: '$comments',
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'comments.data.userId',
          foreignField: 'studentId',
          as: 'comments_user',
        },
      },
      {
        $project: {
          _id: 0,
          userId: 0,
          delete: 0,
          starUserIds: 0,
          user: {
            _id: 0,
            studentId: 0,
            password: 0,
            holeIds: 0,
            __v: 0,
            roles: 0,
            loginInfo: 0,
          },
          __v: 0,
          updatedTime: 0,
        },
      },
    ]

    const mode = dto.mode

    if (mode === 'hot') {
      pipeLineStage.unshift({
        $match: {
          stars: {
            $gt: 0,
          },
        },
      })
    } else if (mode.includes('timeline')) {
      // TODO 使用enum重构
      pipeLineStage.unshift({
        $sort: { createTime: mode === 'timeline-reverse' ? 1 : -1 },
      })
    }

    try {
      const queryRes = (await this.holesModel.aggregate([
        ...pipeLineStage,
        ...[{ $skip: Math.abs(skip) }, { $limit: dto.limit }],
      ])) as ITreeholeListPipeLineStage[]

      const pageRes = await this.holesModel.aggregate(pipeLineStage)

      const data = queryRes.map((item) => {
        item.comments.data = item.comments.data.map((commentItem) => {
          const user = item.comments_user.find(
            (userItem) => userItem.studentId
          )!

          const isOwner = commentItem.userId === user.studentId

          commentItem = {
            ...commentItem,
            user: {
              username: isOwner ? '洞主' : user.username,
            },
          }

          unset(commentItem, 'userId')

          return commentItem
        })

        unset(item, 'comments_user')

        return item
      })

      const pageSize = Math.ceil(pageRes.length / dto.limit)

      return {
        data,
        pageSize,
        nextPage: Math.min(dto.page + 1, pageSize),
        hasNextPage: dto.page !== pageSize,
      }
    } catch (err) {
      throw new InternalServerErrorException('获取树洞列表失败')
    }
  }

  async getDetail(id: number, userId: number) {
    const pipeLineStage: PipelineStage[] = [
      {
        $match: {
          id,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: 'studentId',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $lookup: {
          from: 'users',
          localField: 'comments.userId',
          foreignField: 'studentId',
          as: 'comments_user',
        },
      },
      {
        $addFields: {
          comments_length: {
            $size: '$comments',
          },
        },
      },
      {
        $project: {
          userId: 0,
          _id: 0,
          user: {
            _id: 0,
            password: 0,
            holeIds: 0,
            __v: 0,
            roles: 0,
          },
          __v: 0,
          updatedTime: 0,
        },
      },
    ]

    const res = (
      await this.holesModel.aggregate(pipeLineStage)
    )[0] as ITreeholeDetailPipeLineStage
    const repliesTo: ITreeholeDetailPipeLineStage['comments'] = []

    res.isYourHole = res.user.studentId === userId
    res.comments = res.comments
      .map((item) => {
        const user = res.comments_user.filter(
          (commentItem) => commentItem.studentId === item.userId
        )[0]

        const isOwner = item.userId === res.user.studentId
        if (item.replyTo) {
          repliesTo.push({
            ...item,
            user: { username: isOwner ? '洞主' : user.username },
          })
          // eslint-disable-next-line array-callback-return
          return
        }

        unset(item, 'userId')
        item = {
          ...item,
          isYourComment: user.studentId === userId,
          user: { username: isOwner ? '洞主' : user.username },
          replies: [],
        }

        return item
      })
      .filter(Boolean)

    repliesTo.forEach((r) => {
      const comment = res.comments.find((c) => c._id.equals(r.parentId))
      if (comment) {
        unset(r, 'userId')
        const members = [comment.user]
        if (comment.user.username === res.user.username) {
          comment.user.username = '洞主'
        }
        comment.replies.push({
          ...r,
          members,
        })
      }
    })

    unset(res.user, 'studentId')
    unset(res, 'comments_user')

    res.isStar = isStarHole(res.starUserIds, userId)
    unset(res, 'starUserIds')

    return res
  }

  async findById(id: number) {
    return this.holesModel.findOne({ id })
  }
}
