import { Test, TestingModule } from '@nestjs/testing';
import { UserScoresController } from './user-scores.controller';
import { UserScoresService } from './user-scores.service';

describe('UserScoresController', () => {
  let controller: UserScoresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserScoresController],
      providers: [UserScoresService],
    }).compile();

    controller = module.get<UserScoresController>(UserScoresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
