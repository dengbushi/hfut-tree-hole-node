import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from '@nestjs/common'
import { Request } from 'express'
import Redis from 'ioredis'
import { InjectRedis } from '@liaoliaots/nestjs-redis'
import { RoleService } from '@/modules/role/role.service'

@Injectable()
export class FileGuard implements CanActivate {
  @Inject()
  private readonly roleService: RoleService

  constructor(
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest() as Request

    const isAdmin = await this.roleService.isAdmin(user.studentId)

    if (isAdmin) {
      return true
    }

    const redisKey = `file:upload:${user.studentId}`
    const times = parseInt(await this.redis.get(redisKey))

    if (!times) {
      this.redis.set(redisKey, 1)
    } else if (times < 10) {
      this.redis.incrby(redisKey, 1)
    } else {
      throw new ForbiddenException('你一天只能上传10次文件哦')
    }

    return true
  }
}
