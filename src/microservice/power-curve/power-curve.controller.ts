import { DefaultParamsDto } from '@common/default-dto'
import { PowerCurveService } from '@modules/power-curve/power-curve.service'
import { Controller, Get, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@Controller('power-curve')
@ApiTags('power-curve')
export class PowerCurveController {
  constructor(private readonly powerCurveService: PowerCurveService) {}

  @Get()
  @ApiOperation({
    summary: 'Get power curve for workout',
    description: 'Type data Map',
  })
  async findByWorkoutId(@Query() params: DefaultParamsDto) {
    return this.powerCurveService.findByWorkoutId(params.id)
  }
}
