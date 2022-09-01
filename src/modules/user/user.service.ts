import { Inject, Injectable, InternalServerErrorException, NotAcceptableException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { LoginDataDto } from '../auth/dto/loginData.dto'
import { isNumber } from '../../shared/utils/is'
import { RegisterDataDto } from '../auth/dto/registerData.dto'
import { Users, UsersDocument } from '../../schema/user/user.schema'
import { createResponse } from '../../shared/utils/create'
import { set } from '../../shared/utils/object'
import { IUser } from '../../env'
import { Holes, HolesDocument } from '../../schema/treehole/holes.schema'
import { UserDaoService } from '../../dao/user/user.service'
import { UpdateDto } from './dto/update.dto'

@Injectable()
export class UserService {
  @InjectModel(Users.name)
  private readonly usersModel: Model<UsersDocument>

  @InjectModel(Holes.name)
  private readonly holesModel: Model<HolesDocument>

  @Inject()
  private readonly userDaoService: UserDaoService

  async getUserInfo(payload: IUser): Promise<any> {
    try {
      const user = await this.findOne(payload.studentId)
      const holes = await this.userDaoService.getUserHoles(payload)
      const stars = await this.userDaoService.getStaredHoles(payload)

      const data = {
        user,
        holesPostNum: holes.length || 0,
        stars: stars.length || 0,
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
      await this.usersModel.updateOne({ studentId: user.studentId }, {
        $set: {
          ...dto,
        },
      })

      return createResponse('用户信息更新成功')
    } catch (err) {
      throw new InternalServerErrorException('用户信息更新失败')
    }
  }

  async findOne<T extends '_id' | '__v' | keyof Users>(
    payload: number | Partial<LoginDataDto> | Partial<RegisterDataDto>,
    filterFields: T[] | T = [] as T[],
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
