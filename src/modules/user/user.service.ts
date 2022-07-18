import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { LoginDataDto } from '../auth/dto/loginData.dto'
import { isNumber } from '../../shared/utils/is'
import { RegisterDataDto } from '../auth/dto/registerData.dto'
import { Users, UsersDocument } from '../../entity/user/user.entity'

@Injectable()
export class UserService {
  @InjectModel(Users.name)
  private readonly usersModel: Model<UsersDocument>

  async findOne(payload: number | Partial<LoginDataDto> | Partial<RegisterDataDto>) {
    let user: Users

    if (isNumber(payload)) {
      user = await this.usersModel.findOne({ studentId: payload }).exec()
    } else {
      user = await this.usersModel.findOne({ ...payload }).exec()
    }

    return user
  }
}
