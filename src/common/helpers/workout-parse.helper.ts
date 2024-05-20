import { fileIdMesgsKeys, recordMesgsKeys, sports } from '@common/constants'
import { ConvertValueHelper } from '@common/helpers/convert-value.helper'
import { DeviseInfo, Info, SessionData } from '@common/types'
import { Record } from '@common/types/record'
import { CustomError } from '@custom-error'
import { HttpException, HttpStatus } from '@nestjs/common'
import { pick } from 'lodash'

export class WorkoutParseHelper {
  static async parseFit(file: Express.Multer.File) {
    try {
      const Stream = (await eval(`import('@garmin-fit/sdk/src/stream.js')`))
        .default
      const Decoder = (await eval(`import('@garmin-fit/sdk/src/decoder.js')`))
        .default
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
        Object.values(pick(fileIdMesgs, fileIdMesgsKeys))?.join(' ') || ''
      const workoutName: string = this.getWorkoutName(fileName, wktName)

      const sessionData: SessionData = this.getSessionData(
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
      const records: Record[] = recordMesgs.map((record) =>
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

  private static getSessionData(session: any, recordsLength: number) {
    const result = {}
    const cadenceCoef: number = this.getCadenceCoef(session?.sport || 'other')
    const timeStep: number =
      Number(
        ((session?.totalTimerTime || recordsLength) / recordsLength).toFixed(1),
      ) || 1
    const smoothing: number = this.getSmoothing(timeStep, recordsLength)
    const obj = {
      timestamp: new Date(session.timestamp),
      startTime: new Date(session.startTime),
      totalTimerTime: session.totalTimerTime,
      totalElapsedTime: session.totalElapsedTime,

      totalDistance: ConvertValueHelper.convertDistance(session?.totalDistance),

      avgSpeed: session?.avgSpeed || session?.enhancedAvgSpeed, // m/s
      enhancedAvgSpeed: ConvertValueHelper.convertSpeed(
        session?.enhancedAvgSpeed || session?.avgSpeed,
        cadenceCoef,
      ), // km/h or min/km
      maxSpeed: session?.maxSpeed,
      enhancedMaxSpeed: ConvertValueHelper.convertSpeed(
        session?.enhancedMaxSpeed || session?.maxSpeed,
        cadenceCoef,
      ), // km/h or min/km

      avgHeartRate: Math.round(session?.avgHeartRate),
      minHeartRate: Math.round(session?.minHeartRate),
      maxHeartRate: Math.round(session?.maxHeartRate),

      avgCadence: Math.round(session?.avgCadence * cadenceCoef),
      maxCadence: Math.round(session?.maxCadence * cadenceCoef),

      avgPower: Math.round(session?.avgPower),
      maxPower: Math.round(session?.maxPower),
      normalizedPower: Math.round(session?.normalizedPower),

      totalAscent: Math.round(session?.totalAscent),
      totalDescent: Math.round(session?.totalDescent),
      maxAltitude: Math.round(session?.maxAltitude),
      avgAltitude: Math.round(session?.avgAltitude),
      minAltitude: Math.round(session?.minAltitude),

      maxTemperature: Math.round(session?.maxTemperature),
      avgTemperature: Math.round(session?.avgTemperature),

      totalStrides: Math.round(session?.totalCycles),
      trainingStressScore: Math.round(session?.trainingStressScore),
      totalCalories: Math.round(session?.totalCalories),

      cadenceCoef,
      timeStep,
      smoothing,
    }
    for (const key in obj) {
      if (obj[key]) {
        result[key] = obj[key]
      }
    }
    return result as SessionData
  }

  private static getSessionInfo(
    session: any,
    device: string,
    workoutName: string,
    fileName: string,
    size: number,
  ): Info {
    const sport =
      session?.sport && sports.includes(session.sport.toString().toLowerCase())
        ? session.sport.toString()
        : 'other'
    return {
      sport,
      subSport: session.subSport,
      date: session?.startTime,
      device,
      workoutName,
      fileName,
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

  private static getCadenceCoef(sport: (typeof sports)[number]): number {
    if (
      sport === 'running' ||
      sport === 'training' ||
      sport === 'walking' ||
      sport === 'hiking'
    ) {
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
