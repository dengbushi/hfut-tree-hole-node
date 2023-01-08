import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
} from '@nestjs/common'
import { InjectRedis } from '@liaoliaots/nestjs-redis'
import Redis from 'ioredis'
import { Request } from 'express'
import { RoleService } from '@/modules/role/role.service'
import { constants } from '@/shared/constant/constants'

export class HolePostLimitGuard implements CanActivate {
  @Inject()
  private readonly roleService: RoleService

  constructor(
    @InjectRedis()
    private redis: Redis
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest() as Request

    const isAdmin = await this.roleService.isAdmin(user.studentId)

    if (isAdmin) {
      return true
    }

    const redisKey = `hole:post:${user.studentId}`
    const times = parseInt(await this.redis.get(redisKey))

    if (!times) {
      this.redis.set(redisKey, 1)
    } else if (times < constants.maxPostHoleTimes) {
      this.redis.incrby(redisKey, 1)
    } else {
      throw new ForbiddenException(
        `你一天只能新建${constants.maxPostHoleTimes}个树洞哦`
      )
    }

    return true
  }
}
