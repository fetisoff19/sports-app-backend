import { WorkoutRecord } from '@/common/types/workout-record'

export function getMaxValueForArrayPeriods(
  records: WorkoutRecord[],
  unit: string,
  arrPeriods: number[],
) {
  if (
    (records.length && Number.isInteger(records[0][unit])) ||
    Number.isInteger(records[1][unit])
  ) {
    let timeStep: number
    if (records[0]?.timestamp) {
      timeStep =
        Math.round(
          (records[1].timestamp.getTime() - records[0].timestamp.getTime()) /
            1000,
        ) || 1
    }
    arrPeriods.forEach((item) => item * timeStep)
    const result = new Map() // сумма наибольших значений за промежуток времени
    const temp = {} // сумма значений на данном этапе итерации
    const indexObj = {}
    for (const item of arrPeriods) {
      if (Number.isInteger(item) && item > 0)
        if (item > records.length) continue
      result.set(item, 0)
      temp[item] = 0
      indexObj[item] = ''
    }
    for (let i = 0; i < records.length; i++) {
      if (isNaN(records[i][unit])) continue
      for (const item of arrPeriods) {
        if (item <= records.length) {
          let previousValue = 0
          if (i < item) {
            temp[item] = temp[item] + records[i][unit]
            if (temp[item] > result.get(item)) {
              result.set(item, temp[item])
              indexObj[item] = 0
            }
          } else if (i >= item && Number.isInteger(records[i - item][unit])) {
            previousValue = records[i - item][unit]
            temp[item] =
              temp[item] + records[i][unit] - previousValue
            if (temp[item] > result.get(item)) {
              result.set(item, temp[item])
              indexObj[item] = i - item
            }
          }
        }
      }
    }
    const res = {}
    for (const key of result.keys()) {
      res[key.toString()] = Math.round(result.get(+key) / +key)
    }
    return res
  }
  return null
}
