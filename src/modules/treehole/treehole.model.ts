import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Holes } from '@/schema/treehole/holes.schema'
import { Model } from 'mongoose'

@Injectable()
export class TreeholeModel {
  @InjectModel(Holes.name)
  private readonly holesModel: Model<Holes>
  async getList() {
    const result = await this.holesModel.aggregate([
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
              // @ts-ignore
              data: {
                $slice: ['$comments', 0, 2],
              },
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
    ])

    return result
  }
}
