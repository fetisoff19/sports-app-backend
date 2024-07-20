import { ConvertValueHelper } from '@/common/helpers'
import { ChartPoint, Session, WorkoutRecord } from '@/common/types'
import { CustomError } from '@/custom-error'
import { ChartDataRepository } from '@/db/repository'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ChartsDataService {
  constructor(private readonly chartPointRepository: ChartDataRepository) {}

  public create(points: ChartPoint[], origLength: number, workoutUuid: string) {
    return this.chartPointRepository.create({
      points: JSON.stringify(points),
      array_length: points.length,
      orig_length: origLength,
      workout_uuid: workoutUuid,
    })
  }

  public makeChartsData(
    records: WorkoutRecord[],
    session: Session,
  ): { chartPoints: ChartPoint[]; mutatedSession: Session } {
    try {
      const points: ChartPoint[] = []
      const mutatedSession: Session = { ...session }
      const { smoothing, cadence_coef } = session

      let avgSpeedSmoothing = 0
      let avgPowerSmoothing = 0
      let avgHeartRateSmoothing = 0
      let avgCadenceSmoothing = 0
      let avgAltitudeSmoothing = 0
      let ts = 0

      let maxSpeed = 0
      let avgPower = 0
      let maxPower = 0
      let minHeartRate = 250
      let maxHeartRate = 0
      let avgCadence = 0
      let maxCadence = 0
      let minAltitude = 10000
      let avgAltitude = 0
      let maxAltitude = -500

      records.forEach((record, index) => {
        // if(!record.hasOwnProperty('distance') ||)
        const distance =
          ConvertValueHelper.convertDistance(record?.distance) || 0 // км
        let speed = ConvertValueHelper.convertSpeed(
          record?.enhancedSpeed || record?.speed,
          cadence_coef,
        )
        // cadenceCoef > 1 && record?.enhancedSpeed
        //   ? this.convertSpeed(record.enhancedSpeed)
        //   : +(record?.speed * 3.6).toFixed(1)
        let power = record?.power // Вт
        let heartRate = record?.heartRate
        let cadence = record?.cadence * cadence_coef
        let altitude = Math.round(record?.enhancedAltitude || record?.altitude) // м

        if (altitude) {
          minAltitude = Math.min(minAltitude, altitude)
          maxAltitude = Math.max(maxAltitude, altitude)
        }

        if (heartRate) {
          minHeartRate = Math.min(minHeartRate, heartRate)
        }

        if (isNaN(speed)) speed = 0
        if (isNaN(power)) power = 0
        if (isNaN(heartRate)) heartRate = 0
        if (isNaN(cadence)) cadence = 0
        if (isNaN(altitude)) altitude = 0
        // if (cadenceCoef === 2 && speed < 1.5)
        //   speed = this.convertSpeed(mutatedSession?.enhancedAvgSpeed)
        if (index > 0) {
          const stepTime =
            (record.timestamp.getTime() -
              records[index - 1].timestamp.getTime()) /
            1000 // получаем время в секундах между соседними элементами массива
          ts += stepTime
        }
        avgAltitude += altitude
        avgCadence += cadence
        avgPower += power

        if (smoothing === 1) {
          points.push({
            d: distance,
            s: speed,
            hr: heartRate,
            p: power,
            c: cadence,
            a: altitude,
            ts,
          })
        } else {
          if (index === 0) {
            points.push({
              d: distance,
              s: speed,
              hr: heartRate,
              p: power,
              c: cadence,
              a: altitude,
              ts,
            })
          }

          avgSpeedSmoothing += speed
          maxSpeed = Math.max(maxSpeed, speed)

          avgPowerSmoothing += power
          maxPower = Math.max(maxPower, power)

          avgHeartRateSmoothing += heartRate
          minHeartRate = Math.min(minHeartRate, heartRate)
          maxHeartRate = Math.max(maxHeartRate, heartRate)
          minHeartRate = Math.min(minHeartRate, heartRate)

          avgCadenceSmoothing += cadence
          maxCadence = Math.max(maxCadence, cadence)

          avgAltitudeSmoothing += altitude

          if (!(index % smoothing) && index > 0) {
            points.push({
              d: distance,
              s: Number((avgSpeedSmoothing / smoothing).toFixed(1)),
              hr: Math.round(avgHeartRateSmoothing / smoothing),
              p: Math.round(avgPowerSmoothing / smoothing),
              c: Math.round(avgCadenceSmoothing / smoothing),
              a: Math.round(avgAltitudeSmoothing / smoothing),
              ts,
            })

            avgSpeedSmoothing = 0
            avgPowerSmoothing = 0
            avgHeartRateSmoothing = 0
            avgCadenceSmoothing = 0
            avgAltitudeSmoothing = 0
          }
        }
      })
      // мутируем session, корректируя показатели:
      // if (!mutatedSession.enhancedAvgSpeed && avgSpeed > 0)
      //   mutatedSession.enhancedAvgSpeed = Math.round(avgSpeed / records.length);
      if (!mutatedSession.enhanced_max_speed && maxSpeed > 0)
        mutatedSession.enhanced_max_speed = maxSpeed
      if (!mutatedSession.total_distance && records.at(-1)?.distance > 0)
        mutatedSession.total_distance = records.at(-1).distance
      if (!mutatedSession.avg_power && avgPower > 0)
        mutatedSession.avg_power = Math.round(avgPower / records.length)
      if (!mutatedSession.max_power && maxPower > 0)
        mutatedSession.max_power = maxPower
      if (!mutatedSession.min_heart_rate && minHeartRate < 250)
        mutatedSession.min_heart_rate = minHeartRate
      if (!mutatedSession.max_heart_rate && maxHeartRate > 0)
        mutatedSession.max_heart_rate = maxHeartRate
      if (!mutatedSession.avg_cadence && avgCadence > 0)
        mutatedSession.avg_cadence = Math.round(avgCadence / records.length)
      if (!mutatedSession.max_cadence && maxCadence > 0)
        mutatedSession.max_cadence = maxCadence * cadence_coef
      if (!mutatedSession.avg_altitude && avgAltitude)
        mutatedSession.avg_altitude = Math.round(avgAltitude / records.length)
      if (!mutatedSession.min_altitude && minAltitude !== 10000)
        mutatedSession.min_altitude = minAltitude
      if (!mutatedSession.max_altitude && maxAltitude !== -500)
        mutatedSession.max_altitude = maxAltitude
      return { chartPoints: points, mutatedSession }
    } catch (e) {
      throw new CustomError(500, 'Error while creating charts')
    }
  }
}
