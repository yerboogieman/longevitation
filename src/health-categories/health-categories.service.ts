import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {CreateHealthCategoryDto} from './dto/create-health-category.dto';
import {UpdateHealthCategoryDto} from './dto/update-health-category.dto';
import {UpdateSingleFieldDto} from '../dto/update-single-field.dto';
import {HealthCategory} from './entities/health-category.entity';

@Injectable()
export class HealthCategoriesService {
    constructor(
        @InjectModel(HealthCategory.name) private healthCategoryModel: Model<HealthCategory>,
    ) {
    }

    async create(createHealthCategoryDto: CreateHealthCategoryDto) {
        const createdHealthCategory = new this.healthCategoryModel(createHealthCategoryDto);
        return createdHealthCategory.save();
    }

    async findAll() {
        return this.healthCategoryModel.find().populate('healthMarkers').exec();
    }

    async findOne(id: string) {
        return this.healthCategoryModel.findOne({id}).populate('healthMarkers').exec();
    }

    async remove(id: string) {
        return this.healthCategoryModel.findOneAndDelete({id}).exec();
    }

    async update(id: string, updateHealthCategoryDto: UpdateHealthCategoryDto) {
        return this.healthCategoryModel.findOneAndUpdate({id}, updateHealthCategoryDto, {new: true}).exec();
    }

    async updateField(updateSingleFieldDto: UpdateSingleFieldDto) {
        const {id, fieldName, value} = updateSingleFieldDto;
        return this.healthCategoryModel.findOneAndUpdate(
            {id},
            {[fieldName]: value},
            {new: true}
        ).exec();
    }
}
