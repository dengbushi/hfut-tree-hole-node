import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { InjectRedis } from '@liaoliaots/nestjs-redis'
import Redis from 'ioredis'
import { Cron, CronExpression } from '@nestjs/schedule'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'

@Injectable()
export class FileTaskService {
  @Inject(WINSTON_MODULE_NEST_PROVIDER)
  private readonly logger: LoggerService

  constructor(
    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async removeFileUploadLimit() {
    const keys = await this.redis.keys('file:upload:*')

    for (const key of keys) {
      await this.redis.del(key)
    }

    if (keys?.length) {
      this.logger.log('[FileTaskService] removeFileUploadLimit delete file:upload keys success.')
    }
  }
}
