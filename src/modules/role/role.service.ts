import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Users, UsersDocument } from '../../schema/user/user.schema'
import { UserService } from '../user/user.service'
import { createResponse } from '../../shared/utils/create'
import { Role } from './role.enum'

@Injectable()
export class RoleService {
  @InjectModel(Users.name)
  private readonly usersModel: Model<UsersDocument>

  @Inject()
  private readonly userService: UserService

  async ban(id: number) {
    const res = await this.banUser(id)

    if (!res) {
      throw new BadRequestException('熊孩子在关进小黑屋的途中挣脱了...')
    }

    return createResponse('熊孩子已被关进小黑屋')
  }

  async banUser(id: number) {
    try {
      await this.usersModel.updateOne({ studentId: id }, {
        $push: {
          roles: Role.Banned,
        },
      })
      return true
    } catch (err) {
      return false
    }
  }

  async isAdmin(id: number) {
    const user = await this.userService.findOne(id)
    return user.roles.includes(Role.Admin)
  }

  async isBanned(id: number) {
    const user = await this.userService.findOne(id)
    return user.roles.includes(Role.Banned)
  }
}
