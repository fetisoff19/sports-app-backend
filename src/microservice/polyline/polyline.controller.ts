import { DefaultDto } from '@/common/default-dto';
import { Controller, Get, Query } from '@nestjs/common';
import { PolylineService } from '@/microservice/polyline/polyline.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('polyline')
@ApiTags('polyline')
export class PolylineController {
  constructor(private readonly polylineService: PolylineService) {}

  @Get()
  async findByWorkoutUuid(@Query() params: DefaultDto) {
    return this.polylineService.findByWorkoutUuid(params.uuid);
  }
}
