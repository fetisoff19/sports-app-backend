import { DefaultDto } from '@/common/default-dto';
import { Controller, Get, Query } from '@nestjs/common';
import { ChartsDataService } from '@/microservice/charts-data/charts-data.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('charts-data')
@ApiTags('charts-data')
export class ChartsDataController {
  constructor(private readonly chartDataService: ChartsDataService) {}

  @Get()
  async findByWorkoutUuid(@Query() params: DefaultDto) {
    return this.chartDataService.findChartsDataByUuid(params.uuid);
  }
}
