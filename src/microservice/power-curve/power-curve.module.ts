import { PowerCurveModel } from '@/db/model'
import { PowerCurveRepository } from '@/db/repository'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PowerCurveService } from './power-curve.service'

@Module({
  imports: [TypeOrmModule.forFeature([PowerCurveModel])],
  providers: [PowerCurveService, PowerCurveRepository],
  exports: [PowerCurveService],
})
export class PowerCurveModule {}
