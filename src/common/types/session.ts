export interface Session {
  timestamp: Date
  startTime: Date

  timeStep: number
  smoothing: number
  // date: Date
  totalElapsedTime?: number

  totalTimerTime: number
  totalDistance: number
  totalWork?: number
  totalStrides?: number

  enhancedAvgSpeed?: number
  enhancedMaxSpeed?: number
  avgSpeed?: number
  maxSpeed?: number

  avgHeartRate?: number
  maxHeartRate?: number
  minHeartRate?: number

  cadenceCoef?: number
  avgCadence?: number
  maxCadence?: number
  avgTemperature?: number
  maxTemperature?: number

  enhancedMaxAltitude?: number
  enhancedMinAltitude?: number
  maxAltitude?: number
  avgAltitude?: number
  minAltitude?: number
  totalAscent?: number
  totalDescent?: number

  avgPower?: number
  maxPower?: number
  normalizedPower?: number
  leftRightBalance?: number
  avgLeftTorqueEffectiveness?: number
  avgRightTorqueEffectiveness?: number
  avgLeftPedalSmoothness?: number
  avgRightPedalSmoothness?: number

  totalCalories?: number
  trainingStressScore?: number
}
