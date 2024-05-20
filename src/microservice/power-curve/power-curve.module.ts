import { PowerCurveModel } from '@db/model'
import { PowerCurveRepository } from '@db/repository'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PowerCurveController } from './power-curve.controller'
import { PowerCurveService } from './power-curve.service'

@Module({
  imports: [TypeOrmModule.forFeature([PowerCurveModel])],
  controllers: [PowerCurveController],
  providers: [PowerCurveService, PowerCurveRepository],
  exports: [PowerCurveService],
})
export class PowerCurveModule {}
