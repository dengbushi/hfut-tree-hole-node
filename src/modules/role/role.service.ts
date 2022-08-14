import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common'
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

  async liberate(id: number) {
    const user = await this.userService.findOne(id)

    if (!user.roles.includes(Role.Banned)) {
      throw new BadRequestException('这个人还不是熊孩子呢')
    }

    try {
      await this.usersModel.updateOne({ studentId: id }, {
        $pull: {
          roles: Role.Banned,
        },
      })

      return createResponse('成功释放熊孩子，以后要多注意它哦')
    } catch (err) {
      throw new InternalServerErrorException('释放熊孩子的过程中出了点故障...')
    }
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
