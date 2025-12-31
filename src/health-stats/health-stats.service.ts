import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateHealthStatDto } from './dto/create-health-stat.dto';
import { UpdateHealthStatDto } from './dto/update-health-stat.dto';
import { UpdateSingleFieldDto } from '../dto/update-single-field.dto';
import { HealthStat } from './entities/health-stat.entity';

@Injectable()
export class HealthStatsService {
  constructor(
    @InjectModel(HealthStat.name) private healthStatModel: Model<HealthStat>,
  ) {}

  async create(createHealthStatDto: CreateHealthStatDto) {
    const createdHealthStat = new this.healthStatModel(createHealthStatDto);
    return createdHealthStat.save();
  }

  async findAll() {
    return this.healthStatModel.find().exec();
  }

  async findOne(id: string) {
    return this.healthStatModel.findById(id).exec();
  }

  async remove(id: string) {
    return this.healthStatModel.findByIdAndDelete(id).exec();
  }

  async update(id: string, updateHealthStatDto: UpdateHealthStatDto) {
    return this.healthStatModel.findByIdAndUpdate(id, updateHealthStatDto, { new: true }).exec();
  }

  async updateField(updateSingleFieldDto: UpdateSingleFieldDto) {
    const { id, fieldName, value } = updateSingleFieldDto;
    return this.healthStatModel.findByIdAndUpdate(
      id,
      { [fieldName]: value },
      { new: true }
    ).exec();
  }
}
