import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserScoresService } from './user-scores.service';
import { UserScoresController } from './user-scores.controller';
import { UserScore, UserScoreSchema } from './entities/user-score.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: UserScore.name, schema: UserScoreSchema }])],
  controllers: [UserScoresController],
  providers: [UserScoresService],
})
export class UserScoresModule {}
