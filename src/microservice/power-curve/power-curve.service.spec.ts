import { Test } from '@nestjs/testing'
import { PowerCurveService } from '@/microservice/power-curve/power-curve.service'
import { PowerCurveRepository } from '@/db/repository'
import { WorkoutRecord } from '@/common/types'

const recordsWithoutPower: WorkoutRecord[] = new Array(15).fill({})
const recordsWithPower: WorkoutRecord[] = recordsWithoutPower.map((_, index) =>
  ({ timestamp: new Date(2020, 1, 1, 1, 0, index), power: index }))
const recordsWithPowerWithoutTimestamp: WorkoutRecord[] = recordsWithPower.map((_, index) =>
  ({ power: index * 2 }))
const currentResult1 = { '1': 14, '10': 10, '12': 9, '14': 8, '2': 14, '3': 13, '4': 13, '5': 12, '6': 12, '7': 11, '8': 11, '9': 10 }
const currentResult2 = { '1': 28, '10': 19, '12': 17, '14': 15, '2': 27, '3': 26, '4': 25, '5': 24, '6': 23, '7': 22, '8': 21, '9': 20 }


describe('PowerCurveService', () => {
  let service: PowerCurveService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PowerCurveService,
        {
          provide: PowerCurveRepository,
          useValue: {},
        },
      ],
    }).compile()
    service = module.get<PowerCurveService>(PowerCurveService)

  })
  it('should be defined', () => {
    expect(service).toBeDefined()
  })
  it('should be null', () => expect(service.makePoints([])).toBe(null))
  it('should be null', () => expect(service.makePoints(recordsWithoutPower)).toBe(null))
  it('should be currentResult1', () => expect(service.makePoints(recordsWithPower)).toStrictEqual(currentResult1))
  it('should be currentResult2', () => expect(service.makePoints(recordsWithPowerWithoutTimestamp)).toStrictEqual(currentResult2))
})
