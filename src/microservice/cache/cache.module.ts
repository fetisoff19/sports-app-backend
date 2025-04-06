import { Module } from '@nestjs/common'
import { redisStore } from 'cache-manager-redis-yet'
import { RedisClientOptions } from 'redis'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager'
import { CacheService } from '@/microservice/cache/cache.service'

@Module({
  imports: [
    NestCacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get<string>('redis.host')
        const port = configService.get<string>('redis.port')
        const password = configService.get<string>('redis.password')
        const url = `redis://:${password}@${host}:${port}`
        return {
          isGlobal: true,
          store: redisStore,
          url,
        }
      },
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
