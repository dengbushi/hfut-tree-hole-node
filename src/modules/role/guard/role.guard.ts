import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Role } from '../role.enum'
import { ROLES_KEY } from '../../../common/decorators/roles.decorator'
import { IS_PUBLIC_KEY } from '../../../common/decorators/public.decorator'
import { Users, UsersDocument } from '../../../schema/user/user.schema'

@Injectable()
export class RolesGuard implements CanActivate {
  @InjectModel(Users.name)
  private readonly usersModel: Model<UsersDocument>

  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredRoles || isPublic) {
      return true
    }
    const { user: reqUser } = context.switchToHttp().getRequest() as Request

    const user = await this.usersModel.findOne({ studentId: reqUser.studentId })

    if (!requiredRoles.includes(Role.Banned) && user.roles.includes(Role.Banned)) {
      throw new UnauthorizedException('你已被关进小黑屋')
    }

    const hasRole = requiredRoles.some(role => user.roles?.includes(role))

    if (!hasRole) {
      throw new UnauthorizedException('权限不足')
    }

    return true
  }
}
