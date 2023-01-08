import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { InjectRedis } from '@liaoliaots/nestjs-redis'
import Redis from 'ioredis'
import { Cron, CronExpression } from '@nestjs/schedule'

@Injectable()
export class TaskService {
  @Inject(WINSTON_MODULE_NEST_PROVIDER)
  private readonly logger: LoggerService

  constructor(
    @InjectRedis()
    private readonly redis: Redis
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async removeLimit() {
    const executors = [this.removeFileUploadLimit, this.removeHolePostLimit]

    await Promise.all(executors.map(async (fn) => await fn()))

    this.logger.log('[TaskServices] remove limit keys success.')
  }

  async removeFileUploadLimit() {
    const keys = await this.redis.keys('file:upload:*')

    for (const key of keys) {
      await this.redis.del(key)
    }
  }

  async removeHolePostLimit() {
    const keys = await this.redis.keys('hole:post:*')

    for (const key of keys) {
      await this.redis.del(key)
    }
  }
}
