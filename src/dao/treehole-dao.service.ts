import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, PipelineStage } from 'mongoose'
import { Holes, HolesDocument } from '../schema/treehole/holes.schema'
import { CreateCommentDto, TreeholeListDto } from '../modules/treehole/dto/treehole.dto'
import { IUser } from '../env'

@Injectable()
export class TreeholeDaoService {
  @InjectModel(Holes.name)
  private readonly holesModel: Model<HolesDocument>

  async getList(dto: TreeholeListDto) {
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
        $project: {
          'userId': 0,
          'user': {
            _id: 0,
            studentId: 0,
            password: 0,
            holeIds: 0,
            __v: 0,
          },
          '__v': 0,
          'updatedTime': 0,
          'comments.userId': 0,
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
    } else if (mode === 'timeline') {
      const sortIdx = pipeLineStage.findIndex(item => item === sort)
      pipeLineStage.splice(sortIdx, 1, { $sort: { createdTime: -1 } })
    }

    try {
      return this.holesModel.aggregate(pipeLineStage)
    } catch (err) {
      throw new InternalServerErrorException('获取树洞列表失败')
    }
  }

  async createComment(dto: CreateCommentDto, user: IUser) {
    try {
      await this.holesModel.updateOne({ _id: dto.id }, {
        $push: {
          comments: {
            userId: user.studentId,
            content: dto.content,
            createTime: new Date(),
          },
        },
      })
    } catch (err) {
      throw new InternalServerErrorException('留言失败')
    }
  }
}
