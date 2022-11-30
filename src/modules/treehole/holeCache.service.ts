import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { HolesDocument } from '@/schema/treehole/holes.schema'
import { cacheKey } from '@/shared/constant/cacheKeys'

@Injectable()
export class HoleCacheService {
  @Inject(CACHE_MANAGER)
  private cacheManager: Cache

  async useHole<T>(cb: (hole: HolesDocument) => T | Promise<T>) {
    const hole = await this.cacheManager.get(cacheKey.Hole) as HolesDocument
    const res = await cb(hole)

    await this.cacheManager.del(cacheKey.Hole)

    return res
  }
}
