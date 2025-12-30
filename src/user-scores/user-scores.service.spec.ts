import { Test, TestingModule } from '@nestjs/testing';
import { UserScoresService } from './user-scores.service';

describe('UserScoresService', () => {
  let service: UserScoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserScoresService],
    }).compile();

    service = module.get<UserScoresService>(UserScoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
