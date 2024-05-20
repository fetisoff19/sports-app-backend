import { DefaultDto } from '@/common/default-dto';
import { Controller, Get, Query } from '@nestjs/common';
import { PowerCurveService } from '@/microservice/power-curve/power-curve.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('power-curve')
@ApiTags('power-curve')
export class PowerCurveController {
  constructor(private readonly powerCurveService: PowerCurveService) {}

  @Get()
  async findByWorkoutUuid(@Query() params: DefaultDto) {
    return this.powerCurveService.findByWorkoutUuid(params.uuid);
  }

}
