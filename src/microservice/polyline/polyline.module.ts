import { PolylineModel } from '@/db/model'
import { PolylineRepository } from '@/db/repository'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PolylineService } from './polyline.service'

@Module({
  imports: [TypeOrmModule.forFeature([PolylineModel])],
  providers: [PolylineService, PolylineRepository],
  exports: [PolylineService],
})
export class PolylineModule {}
