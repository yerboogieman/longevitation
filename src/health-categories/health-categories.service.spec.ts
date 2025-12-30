import { Test, TestingModule } from '@nestjs/testing';
import { HealthCategoriesService } from './health-categories.service';

describe('HealthCategoriesService', () => {
  let service: HealthCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthCategoriesService],
    }).compile();

    service = module.get<HealthCategoriesService>(HealthCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
