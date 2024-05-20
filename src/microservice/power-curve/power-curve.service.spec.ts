import { Test, TestingModule } from '@nestjs/testing'

import { PowerCurveService } from './power-curve.service'

describe('PowerCurveService', () => {
  let service: PowerCurveService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PowerCurveService],
    }).compile()

    service = module.get<PowerCurveService>(PowerCurveService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
