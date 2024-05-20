import { Test, TestingModule } from '@nestjs/testing'

import { ChartsDataController } from './charts-data.controller'

describe('ChartDataController', () => {
  let controller: ChartsDataController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChartsDataController],
    }).compile()

    controller = module.get<ChartsDataController>(ChartsDataController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
