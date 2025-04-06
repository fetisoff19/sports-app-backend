import { Inject, Injectable } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheService: Cache) {}

  public async get<T = any>(pattern: string): Promise<T | null | undefined>{
    return this.cacheService.get(pattern) ?? null
  }

  public async save<T = any>(key: string, value: T, ttl: number = 24 * 3600 * 1000): Promise<void>{
    return this.cacheService.set(key, value, ttl)
  }

  public async remove(pattern: string) {
    const keys = await this.cacheService.store.keys(pattern)
    for (const key of keys) {
      await this.cacheService.del(key)
    }
  }






}
