import { deviceInfoKeys, recordMesgsKeys, sports } from '@/common/constants'
import { ConvertValueHelper } from '@/common/helpers/convert-value.helper'
import { DeviseInfo, Info, Session, WorkoutRecord } from '@/common/types'
import { CustomError } from '@/custom-error'
import { HttpException, HttpStatus } from '@nestjs/common'
import { pick } from 'lodash'

export class WorkoutParseHelper {
  static async parseFit(file: Express.Multer.File) {
    try {
      const fitsdk = (await import('@garmin/fitsdk'))
      const { Decoder, Stream } = fitsdk

      const streamFromBuffer = Stream.fromBuffer(file?.buffer)
      const decoder = new Decoder(streamFromBuffer)
      const { messages } = decoder.read()
      if (messages?.sessionMesgs?.at(0)) {
        return {
          ...messages,
          size: file?.size,
          originalname: file?.originalname,
        }
      }
      throw new CustomError(422, `File ${file?.originalname} not supported`)
    } catch (e) {
      throw new CustomError(422, `File ${file?.originalname} not supported`)
    }
  }

  static getWorkoutData(parseFit) {
    try {
      const sessionMesgs: any = parseFit?.sessionMesgs?.at(0)
      const recordMesgs: any[] = parseFit?.recordMesgs
      const fileIdMesgs: DeviseInfo = {
        ...parseFit?.fileIdMesgs?.at(0),
        ...parseFit?.deviceInfoMesgs?.at(0),
      }
      const wktName: string = parseFit?.workoutMesgs?.at(0)?.wktName
      const fileName: string = parseFit?.originalname
      const device: string =
        Object.values(pick(fileIdMesgs, deviceInfoKeys))?.join(' ') || ''
      const workoutName: string = this.getWorkoutName(fileName, wktName)

      const sessionData: Session = this.getSessionData(
        sessionMesgs,
        recordMesgs.length,
      )
      const info = this.getSessionInfo(
        sessionMesgs,
        device,
        workoutName,
        fileName,
        parseFit.size,
      )
      const records: WorkoutRecord[] = recordMesgs.map((record) =>
        pick(record, recordMesgsKeys),
      )
      const laps = parseFit?.lapMesgs
      return { sessionData, info, records, laps }
    } catch (e) {
      throw new HttpException(
        `File ${parseFit?.fileName} not supported`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }
  }

  private static getSessionData(
    session: Record<string, any>,
    recordsLength: number,
  ) {
    const result = {}
    const cadence_coef = this.getCadenceCoef(session?.sport || 'other')
    const time_step: number =
      Number(
        ((session?.totalTimerTime || recordsLength) / recordsLength).toFixed(1),
      ) || 1
    const smoothing: number = this.getSmoothing(time_step, recordsLength)
    const obj = {
      start_time: new Date(session.startTime),
      end_time: new Date(session.timestamp),
      total_timer_time: session.totalTimerTime,
      total_elapsed_time: session.totalElapsedTime,

      total_distance: ConvertValueHelper.convertDistance(
        session?.totalDistance,
      ),

      avg_speed:
        session?.totalDistance > 1
          ? ConvertValueHelper.convertSpeed(session?.avgSpeed, cadence_coef)
          : 0, // km/h or min/km
      enhanced_avg_speed:
        session?.totalDistance > 1
          ? ConvertValueHelper.convertSpeed(
              session?.enhancedAvgSpeed || session?.avgSpeed,
              cadence_coef,
            )
          : 0, // km/h or min/km
      max_speed:
        session?.totalDistance > 1
          ? ConvertValueHelper.convertSpeed(session?.maxSpeed, cadence_coef)
          : 0, // km/h or min/km
      enhanced_max_speed: ConvertValueHelper.convertSpeed(
        session?.enhancedMaxSpeed || session?.maxSpeed,
        cadence_coef,
      ), // km/h or min/km

      avg_heart_rate: Math.round(session?.avgHeartRate),
      min_heart_rate: Math.round(session?.minHeartRate),
      max_heart_rate: Math.round(session?.maxHeartRate),

      avg_cadence: Math.round(session?.avgCadence * cadence_coef),
      max_cadence: Math.round(session?.maxCadence * cadence_coef),

      avg_power: Math.round(session?.avgPower),
      max_power: Math.round(session?.maxPower),
      normalized_power: Math.round(session?.normalizedPower),

      total_ascent: Math.round(session?.totalAscent),
      total_descent: Math.round(session?.totalDescent),
      max_altitude: Math.round(session?.maxAltitude),
      avg_altitude: Math.round(session?.avgAltitude),
      min_altitude: Math.round(session?.minAltitude),

      max_temperature: Math.round(session?.maxTemperature),
      avg_temperature: Math.round(session?.avgTemperature),

      total_strides: Math.round(session?.totalCycles),
      training_stress_score: Math.round(session?.trainingStressScore),
      total_calories: Math.round(session?.totalCalories),

      cadence_coef,
      time_step,
      smoothing: smoothing,
    }
    for (const key in obj) {
      if (obj[key]) {
        result[key] = obj[key]
      }
    }
    return result as Session
  }

  private static getSessionInfo(
    session: any,
    device: string,
    workoutName: string,
    file_name: string,
    size: number,
  ): Info {
    const sport =
      session?.sport && sports.includes(session.sport.toString().toLowerCase())
        ? session.sport.toString()
        : 'other'
    return {
      sport,
      sub_sport: session.subSport,
      date: session?.startTime,
      device,
      name: workoutName,
      file_name,
      size,
      note: '',
    }
  }

  private static getWorkoutName(
    fileName: string,
    name?: string[] | string,
  ): string {
    if (name) {
      if (Array.isArray(name)) {
        return name.join(' ')
      }
      if (typeof name === 'string') {
        return name
      }
    }
    return fileName.split('.').slice(0, -1).join('')
  }

  private static getCadenceCoef(
    sport: (typeof sports)[number],
  ): Session['cadence_coef'] {
    if (['running', 'training', 'walking', 'hiking'].includes(sport)) {
      return 2
    }
    return 1
  }

  private static getSmoothing(timeStep: number, recordsLength: number): number {
    if (recordsLength < 3600) return 1
    if (timeStep < 1.5 && recordsLength < 7200) return 2
    if (recordsLength < 14400) return 4
    else return 8
  }
}
