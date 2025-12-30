import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateHealthMarkerDto } from './dto/create-health-marker.dto';
import { UpdateHealthMarkerDto } from './dto/update-health-marker.dto';
import { UpdateSingleFieldDto } from '../dto/update-single-field.dto';
import { HealthMarker } from './entities/health-marker.entity';

@Injectable()
export class HealthMarkersService {
  constructor(
    @InjectModel(HealthMarker.name) private healthMarkerModel: Model<HealthMarker>,
  ) {}

  async create(createHealthMarkerDto: CreateHealthMarkerDto) {
    const createdHealthMarker = new this.healthMarkerModel(createHealthMarkerDto);
    return createdHealthMarker.save();
  }

  async findAll() {
    return this.healthMarkerModel.find().populate('parentCategory').exec();
  }

  async findOne(id: string) {
    return this.healthMarkerModel.findOne({ id }).populate('parentCategory').exec();
  }

  async update(id: string, updateHealthMarkerDto: UpdateHealthMarkerDto) {
    return this.healthMarkerModel.findOneAndUpdate({ id }, updateHealthMarkerDto, { new: true }).exec();
  }

  async updateField(updateSingleFieldDto: UpdateSingleFieldDto) {
    const { id, fieldName, value } = updateSingleFieldDto;
    return this.healthMarkerModel.findOneAndUpdate(
      { id },
      { [fieldName]: value },
      { new: true }
    ).exec();
  }

  async remove(id: string) {
    return this.healthMarkerModel.findOneAndDelete({ id }).exec();
  }
}
