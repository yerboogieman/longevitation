import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserScoreDto } from './dto/create-user-score.dto';
import { UpdateUserScoreDto } from './dto/update-user-score.dto';
import { UpdateSingleFieldDto } from '../dto/update-single-field.dto';
import { UserScore } from './entities/user-score.entity';

@Injectable()
export class UserScoresService {
  constructor(
    @InjectModel(UserScore.name) private userScoreModel: Model<UserScore>,
  ) {}

  async create(createUserScoreDto: CreateUserScoreDto) {
    const createdUserScore = new this.userScoreModel(createUserScoreDto);
    return createdUserScore.save();
  }

  async findAll() {
    return this.userScoreModel.find().exec();
  }

  async findOne(id: string) {
    return this.userScoreModel.findById(id).exec();
  }

  async update(id: string, updateUserScoreDto: UpdateUserScoreDto) {
    return this.userScoreModel.findByIdAndUpdate(id, updateUserScoreDto, { new: true }).exec();
  }

  async updateField(updateSingleFieldDto: UpdateSingleFieldDto) {
    const { id, fieldName, value } = updateSingleFieldDto;
    return this.userScoreModel.findByIdAndUpdate(
      id,
      { [fieldName]: value },
      { new: true }
    ).exec();
  }

  async remove(id: string) {
    return this.userScoreModel.findByIdAndDelete(id).exec();
  }
}
