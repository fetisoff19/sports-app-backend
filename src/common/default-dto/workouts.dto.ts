import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class WorkoutDto {
  @IsString()
  @IsNotEmpty()
  user: string

  @IsString()
  @IsNotEmpty()
  sport: string

  @IsNumber()
  @IsOptional()
  cadenceCoef: number

  @IsString()
  @IsOptional()
  subSport: string

  @IsNumber()
  totalTimerTime: number

  @IsNumber()
  totalElapsedTime: number

  @IsDate()
  startTime: Date

  @IsDate()
  timestamp: Date
  @IsDate()
  date: Date

  @IsNumber()
  @IsOptional()
  totalDistance: number

  @IsNumber()
  @IsOptional()
  avgSpeed: number

  @IsNumber()
  @IsOptional()
  enhancedAvgSpeed: number

  @IsNumber()
  @IsOptional()
  maxSpeed: number

  @IsNumber()
  @IsOptional()
  enhancedMaxSpeed: number

  @IsNumber()
  @IsOptional()
  avgHeartRate: number

  @IsNumber()
  @IsOptional()
  minHeartRate: number

  @IsNumber()
  @IsOptional()
  maxHeartRate: number

  @IsNumber()
  @IsOptional()
  avgCadence: number

  @IsNumber()
  @IsOptional()
  maxCadence: number

  @IsNumber()
  @IsOptional()
  avgPower: number

  @IsNumber()
  @IsOptional()
  maxPower: number

  @IsNumber()
  @IsOptional()
  normalizedPower: number

  @IsNumber()
  @IsOptional()
  totalAscent: number

  @IsNumber()
  @IsOptional()
  totalDescent: number

  @IsNumber()
  @IsOptional()
  maxAltitude: number

  @IsNumber()
  @IsOptional()
  avgAltitude: number

  @IsNumber()
  @IsOptional()
  minAltitude: number

  @IsNumber()
  @IsOptional()
  @IsNumber()
  @IsOptional()
  maxTemperature: number

  @IsNumber()
  @IsOptional()
  avgTemperature: number

  @IsNumber()
  @IsOptional()
  totalStrides: number

  @IsNumber()
  @IsOptional()
  trainingStressScore: number

  @IsNumber()
  @IsOptional()
  totalCalories: number

  @IsNumber()
  @IsOptional()
  timeStep: number
}
