import { Record } from '@common/types/record'

export function getMaxValueForArrayPeriods(
  records: Record[],
  unit: string,
  arrPeriods: number[],
) {
  const points = new Map<
    number,
    {
      value: number
      index: number
    }
  >()
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
    // let periodBetweenStep = 1;
    const result = new Map() // здесь будем хранить сумму наибольших значений за промежуток времени
    const partialSum = {} // здесь будем хранить сумму значений на данном этапе итерации
    const indexObj = {}
    for (let item of arrPeriods) {
      if (Number.isInteger(item) && item > 0)
        if (item > records.length) continue
      result.set(item, 0)
      partialSum[item] = 0
      indexObj[item] = ''
    }
    for (let i = 0; i < records.length; i++) {
      if (isNaN(records[i][unit])) continue
      // if (i > 0)
      // periodBetweenStep = Math.round((data[i].timestamp - data[i - 1].timestamp) / 1000);// обнуляем счётчик partialSum
      for (const item of arrPeriods) {
        if (item <= records.length) {
          // if ((periodBetweenStep - timestamp) / item > 0.2) { // если пауза была больше 20%, то сбрасываем partialSum[item]
          //     console.log (periodBetweenStep, item, i)
          //     partialSum[item] = 0;
          // }
          let previousValue = 0
          if (i < item) {
            partialSum[item] = partialSum[item] + records[i][unit]
            if (partialSum[item] > result.get(item)) {
              result.set(item, partialSum[item])
              indexObj[item] = 0
            }
          } else if (i >= item && Number.isInteger(records[i - item][unit])) {
            previousValue = records[i - item][unit]
            partialSum[item] =
              partialSum[item] + records[i][unit] - previousValue
            if (partialSum[item] > result.get(item)) {
              result.set(item, partialSum[item])
              indexObj[item] = i - item
            }
          }
        }
      }
    }
    // for (const key of result.keys()) {
    //   points.set(key.toString(), {
    //     value: Math.round(result.get(+key) / +key),
    //     index: Number(indexObj[Number(key)]),
    //   })
    // }
    // return JSON.stringify(Object.fromEntries(points))
    const res = {}
    for (const key of result.keys()) {
      res[key.toString()] = Math.round(result.get(+key) / +key)
    }
    return res
  }
  return null
}
