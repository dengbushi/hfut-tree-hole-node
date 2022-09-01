import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Holes, HolesDocument } from '../../schema/treehole/holes.schema'
import { Users, UsersDocument } from '../../schema/user/user.schema'
import { IUser } from '../../env'

@Injectable()
export class UserDaoService {
  @InjectModel(Holes.name)
  private readonly holesModel: Model<HolesDocument>

  @InjectModel(Users.name)
  private readonly usersModel: Model<UsersDocument>

  async getUserHoles(user: IUser) {
    return this.holesModel.find({ userId: user.studentId })
  }

  async getStaredHoles(user: IUser) {
    return this.usersModel.aggregate([
      {
        $lookup: {
          from: 'holes',
          localField: 'studentId',
          foreignField: 'starUserIds',
          as: 'res',
        } as any,
      },
      {
        $match: { studentId: user.studentId },
      },
    ])
  }
}
