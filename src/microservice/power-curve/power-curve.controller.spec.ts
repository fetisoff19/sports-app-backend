import { Test, TestingModule } from '@nestjs/testing';

import { PowerCurveController } from './power-curve.controller';

describe('PowerCurveController', () => {
  let controller: PowerCurveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PowerCurveController],
    }).compile();

    controller = module.get<PowerCurveController>(PowerCurveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
