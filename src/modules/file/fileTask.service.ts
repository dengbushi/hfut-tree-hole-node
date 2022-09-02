import { Injectable } from '@nestjs/common'
import { InjectRedis } from '@liaoliaots/nestjs-redis'
import Redis from 'ioredis'
import { Cron, CronExpression } from '@nestjs/schedule'

@Injectable()
export class FileTaskService {
  constructor(
    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async removeFileUploadLimit() {
    const keys = await this.redis.keys('file:upload:*')

    for (const key of keys) {
      await this.redis.del(key)
    }
  }
}
