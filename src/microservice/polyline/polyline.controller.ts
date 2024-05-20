import { DefaultParamsDto } from '@common/default-dto'
import { PolylineService } from '@modules/polyline/polyline.service'
import { Controller, Get, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@Controller('polyline')
@ApiTags('polyline')
export class PolylineController {
  constructor(private readonly polylineService: PolylineService) {}

  @ApiOperation({ summary: 'Get polyline by workout id' })
  @Get()
  async findByWorkoutId(@Query() params: DefaultParamsDto) {
    return this.polylineService.findByWorkoutId(params.id)
  }
}
