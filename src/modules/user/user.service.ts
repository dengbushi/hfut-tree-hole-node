import { Injectable, NotAcceptableException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { LoginDataDto } from '../auth/dto/loginData.dto'
import { isNumber } from '../../shared/utils/is'
import { RegisterDataDto } from '../auth/dto/registerData.dto'
import { Users, UsersDocument } from '../../entity/user/user.entity'
import { ITokenData } from '../auth/guard/type'
import { createResponse } from '../../shared/utils/create'
import { set } from '../../shared/utils/object'

@Injectable()
export class UserService {
  @InjectModel(Users.name)
  private readonly usersModel: Model<UsersDocument>

  async getUserInfo(payload: ITokenData) {
    const user = await this.findOne(payload.studentId, 'password')

    if (!user) {
      throw new NotAcceptableException('用户信息获取失败')
    }

    return createResponse('用户信息获取成功', user)
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
