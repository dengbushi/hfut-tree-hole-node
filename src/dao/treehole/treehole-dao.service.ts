import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import Mongoose, { Model, PipelineStage } from 'mongoose'
import { Holes, HolesDocument } from '../../schema/treehole/holes.schema'
import { TreeholeListDto } from '../../modules/treehole/dto/treehole.dto'
import { unset } from '../../shared/utils/object'
import { ITreeholeDetailPipeLineStage, ITreeholeListPipeLineStage } from './types'
import { isStarHole } from './utils'

@Injectable()
export class TreeholeDaoService {
  @InjectModel(Holes.name)
  private readonly holesModel: Model<HolesDocument>

  async getList(dto: TreeholeListDto, userId: number) {
    const sort: PipelineStage = {
      $sort: { stars: -1, createTime: -1 },
    }

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
          user: {
            _id: 0,
            studentId: 0,
            password: 0,
            holeIds: 0,
            __v: 0,
            roles: 0,
          },
          __v: 0,
          updatedTime: 0,
        },
      },
      sort,
      {
        $skip: dto.skip,
      },
      {
        $limit: dto.limit,
      },
    ]

    const mode = dto.mode

    if (mode === 'hot') {
      pipeLineStage.unshift({
        $match: {
          stars: {
            $gt: 200,
          },
        },
      })
    } else if (mode.includes('timeline')) {
      const sortIdx = pipeLineStage.findIndex(item => item === sort)
      pipeLineStage.splice(sortIdx, 1, { $sort: { createdTime: -1 } })
    }

    try {
      const queryRes = await this.holesModel.aggregate(pipeLineStage) as ITreeholeListPipeLineStage[]

      return queryRes.map((item) => {
        item.comments.data = item.comments.data.map((commentItem) => {
          const user = item.comments_user.find(userItem => userItem.studentId)!

          commentItem = {
            ...commentItem,
            user: {
              username: user.username,
            },
          }

          unset(commentItem, 'userId')

          return commentItem
        })

        unset(item, 'comments_user')

        return item
      })
    } catch (err) {
      throw new InternalServerErrorException('获取树洞列表失败')
    }
  }

  async getDetail(id: number, userId: number) {
    const pipeLineStage: PipelineStage[] = [{
      $match: {
        id,
      },
    }, {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: 'studentId',
        as: 'user',
      },
    }, {
      $unwind: '$user',
    }, {
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
    }]

    const res = (await this.holesModel.aggregate(pipeLineStage))[0] as ITreeholeDetailPipeLineStage

    res.isOwner = res.user.studentId === userId

    res.comments = res.comments.map((item) => {
      const user = res.comments_user.filter(commentItem => commentItem.studentId === item.userId)[0]

      unset(item, 'userId')

      item = {
        ...item,
        isOwner: user.studentId === userId,
        user: {
          username: user.username,
        },
      }

      return item
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
