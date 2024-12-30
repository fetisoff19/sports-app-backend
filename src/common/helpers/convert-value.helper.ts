import { Session } from '@/common/types'

export class ConvertValueHelper {
  static convertDistance(value: number) {
    return Number((value / 1000).toFixed(2))
  }

  static convertSpeed(value: number, cadenceCoef: Session['cadence_coef']) {
    // speed km/h
    if (cadenceCoef === 1) {
      return Number((value * 3.6).toFixed(1))
    }
    // pace min/km
    if (cadenceCoef === 2) {
      return Number((60 / (3.6 * value)).toFixed(2))
    }
  }
}
