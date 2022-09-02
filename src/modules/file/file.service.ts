import { Injectable } from '@nestjs/common'
import { InjectRedis } from '@liaoliaots/nestjs-redis'
import Redis from 'ioredis'
import { Roles } from '../../common/decorators/roles.decorator'
import { Role } from '../role/role.enum'

@Injectable()
@Roles([Role.User, Role.Admin])
export class FileService {
  constructor(
    @InjectRedis()
    private readonly redis: Redis,
  ) {
  }

  test() {
    this.redis.set('1', 2)
  }
}
