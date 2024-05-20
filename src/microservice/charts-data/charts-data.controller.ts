import { DefaultParamsDto } from '@common/default-dto'
import { ChartsDataService } from '@modules/charts-data/charts-data.service'
import { Controller, Get, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@Controller('charts-data')
@ApiTags('charts-data')
export class ChartsDataController {
  constructor(private readonly chartDataService: ChartsDataService) {}

  @ApiOperation({ summary: 'Get polyline for workout' })
  @Get()
  async getChartsData(@Query() params: DefaultParamsDto) {
    return this.chartDataService.findChartsDataById(params.id)
  }
}
