import { WorkoutRecord } from '@/common/types';
import { PolylineRepository } from '@/db/repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PolylineService {
  constructor(private readonly polylineRepository: PolylineRepository) {}

  create(points: [number, number][], origLength: number, workoutUuid: string) {
    return this.polylineRepository.create({
      points: JSON.stringify(points),
      origLength,
      arrayLength: points.length,
      workoutUuid,
    });
  }

  async findByWorkoutUuid(uuid: string) {
    return this.polylineRepository.findByWorkoutUuid(uuid);
  }

  getPoints(records: WorkoutRecord[], smoothing: number) {
    const points: [number, number][] = [];
    if (Object.hasOwn(records.at(0), 'positionLat') ||
      Object.hasOwn(records[Math.round(records.length / 2)],'positionLat') ||
      Object.hasOwn(records.at(-1),'positionLat')
    ) {
      records.forEach((record, index) => {
        if (
          !(index % smoothing) &&
          Object.hasOwn(record,'positionLat') &&
          Object.hasOwn(record,'positionLong')
        ) {
          points.push(this.convertGarminLatLongToNormal(record));
        }
      });
      return points;
    }
    return points;
  }

  private convertGarminLatLongToNormal(records: WorkoutRecord): [number, number] {
    const { positionLat, positionLong } = records;
    const divisor = 11930465;
    return [positionLat / divisor, positionLong / divisor];
  }
}
