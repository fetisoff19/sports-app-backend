import { ChartDataModel } from '@/db/model'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ChartDataRepository } from '@/db/repository'
import { ChartsDataService } from './charts-data.service'

@Module({
  imports: [TypeOrmModule.forFeature([ChartDataModel])],
  providers: [ChartsDataService, ChartDataRepository],
  exports: [ChartsDataService],
})
export class ChartsDataModule {}
