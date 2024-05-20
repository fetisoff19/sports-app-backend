import { ChartDataModel } from '@db/model'
import { ChartDataRepository } from '@db/repository'
import { ChartsDataController } from '@modules/charts-data/charts-data.controller'
import { ChartsDataService } from '@modules/charts-data/charts-data.service'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([ChartDataModel])],
  controllers: [ChartsDataController],
  providers: [ChartsDataService, ChartDataRepository],
  exports: [ChartsDataService],
})
export class ChartsDataModule {}
