import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { InjectRedis } from '@liaoliaots/nestjs-redis'
import Redis from 'ioredis'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { Roles } from '../../common/decorators/roles.decorator'
import { Role } from '../role/role.enum'

@Injectable()
@Roles([Role.User, Role.Admin])
export class FileService {
  constructor(
    @InjectRedis()
    private readonly redis: Redis,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
  }

  test() {
    this.logger.log('你在狗叫什么')
    this.redis.set('1', 2)
  }
}
