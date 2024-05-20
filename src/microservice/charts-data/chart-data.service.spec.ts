import { Test, TestingModule } from '@nestjs/testing';

import { ChartsDataService } from './charts-data.service';

describe('ChartDataService', () => {
  let service: ChartsDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChartsDataService],
    }).compile();

    service = module.get<ChartsDataService>(ChartsDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
