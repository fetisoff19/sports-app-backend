import { Record } from '@common/types'
import { PolylineRepository } from '@db/repository'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'

@Injectable()
export class PolylineService {
  constructor(private readonly polylineRepository: PolylineRepository) {}

  // makePolyline(records: Record[], smoothing: number) {
  //   const chartPoints: [number, number][] = this.getPoints(records, smoothing)
  //   if (chartPoints) {
  //     return this.polylineRepository.create({
  //       chartPoints,
  //       origLength: records.length,
  //       arrayLength: chartPoints.length,
  //     })
  //   }
  //   return null
  // }

  create(points: [number, number][], origLength: number, workoutId: number) {
    return this.polylineRepository.create({
      points: JSON.stringify(points),
      origLength,
      arrayLength: points.length,
      workoutId,
    })
  }

  async findByWorkoutId(id: number | string) {
    return this.polylineRepository.findByWorkoutId(id)
  }

  getPoints(records: Record[], smoothing: number) {
    const points: [number, number][] = []
    if (
      records.at(-1).hasOwnProperty('positionLat') ||
      records[Math.round(records.length / 2)].hasOwnProperty('positionLat') ||
      records[0].hasOwnProperty('positionLat')
    ) {
      records.forEach((record, index) => {
        if (
          !(index % smoothing) &&
          record.hasOwnProperty('positionLat') &&
          record.hasOwnProperty('positionLat')
        ) {
          points.push(this.convertGarminLatLongToNormal(record))
        }
      })
      return points
    }
    return points
  }

  private convertGarminLatLongToNormal(records: Record): [number, number] {
    const { positionLat, positionLong } = records
    const divisor = 11930465
    return [positionLat / divisor, positionLong / divisor]
  }
}
