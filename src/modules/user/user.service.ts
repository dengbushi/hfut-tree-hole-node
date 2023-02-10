import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UpdateDto } from './dto/update.dto'
import { LoginDataDto } from '@/modules/auth/dto/loginData.dto'
import { RegisterDataDto } from '@/modules/auth/dto/registerData.dto'
import { isNumber } from '@/shared/utils/is'
import { Users, UsersDocument } from '@/schema/user/user.schema'
import { createResponse } from '@/shared/utils/create'
import { set } from '@/shared/utils/object'
import { IUser } from '@/env'
import { Holes, HolesDocument } from '@/schema/treehole/holes.schema'
import { UserDaoService } from '@/dao/user/user.service'

@Injectable()
export class UserService {
  @InjectModel(Users.name)
  private readonly usersModel: Model<UsersDocument>

  @InjectModel(Holes.name)
  private readonly holesModel: Model<HolesDocument>

  @Inject()
  private readonly userDaoService: UserDaoService

  async getUserInfo(user: IUser): Promise<any> {
    try {
      const userData = await this.findOne(user.studentId, [
        'password',
        'loginInfo',
      ])
      const holes = await this.getHoles(user)
      const stars = await this.getHolesStar(user)

      const data = {
        user: userData,
        holesPostNum: holes.data.length || 0,
        stars: stars.data.length || 0,
      }
      return createResponse('用户信息获取成功', data)
    } catch (err) {
      throw new InternalServerErrorException('用户信息获取失败')
    }
  }

  async update(dto: UpdateDto, user: IUser) {
    if (dto.username) {
      const user = await this.usersModel.findOne({ username: dto.username })

      if (user) {
        throw new NotAcceptableException('这个名字已经被占用啦')
      }
    }

    try {
      await this.usersModel.updateOne(
        { studentId: user.studentId },
        {
          $set: {
            ...dto,
          },
        }
      )

      return createResponse('用户信息更新成功')
    } catch (err) {
      throw new InternalServerErrorException('用户信息更新失败')
    }
  }

  async getHoles(user: IUser) {
    const list = await this.holesModel.find(
      { userId: user.studentId },
      { starUserIds: 0, comments: 0 }
    )

    return createResponse('获取用户树洞列表成功', list)
  }

  async getHolesStar(user: IUser) {
    const list = await this.holesModel.find(
      {
        starUserIds: {
          $elemMatch: { $eq: user.studentId },
        },
      },
      { starUserIds: 0, userId: 0, comments: 0 }
    )

    return createResponse('获取用户树洞star列表成功', list)
  }

  async findOne<T extends '_id' | '__v' | keyof Users>(
    payload: number | Partial<LoginDataDto> | Partial<RegisterDataDto>,
    filterFields: T[] | T = [] as T[]
  ) {
    let user: Users

    const options = { _id: 0, __v: 0 } as unknown as Partial<Record<T, number>>

    if (!Array.isArray(filterFields)) {
      filterFields = [filterFields]
    }

    filterFields.forEach((fieldName) => {
      set(options, fieldName, 0)
    })

    if (isNumber(payload)) {
      user = await this.usersModel.findOne({ studentId: payload }, options)
    } else {
      user = await this.usersModel.findOne({ ...payload }, options)
    }

    return user
  }
}
