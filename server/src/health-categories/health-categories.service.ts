import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {CreateHealthCategoryDto} from './dto/create-health-category.dto';
import {UpdateHealthCategoryDto} from './dto/update-health-category.dto';
import {UpdateSingleFieldDto} from '../dto/update-single-field.dto';
import {HealthCategory} from './entities/health-category.entity';
import {HealthMarker} from '../health-markers/entities/health-marker.entity';

@Injectable()
export class HealthCategoriesService {
    constructor(
        @InjectModel(HealthCategory.name) private healthCategoryModel: Model<HealthCategory>,
        @InjectModel(HealthMarker.name) private healthMarkerModel: Model<HealthMarker>,
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
        const category = await this.healthCategoryModel.findOne({id}).exec();
        if (!category) {
            return null;
        }

        // Remove this category from all associated markers
        await this.healthMarkerModel.updateMany(
            {_id: {$in: category.healthMarkers as any}},
            {$pull: {healthCategories: category._id}}
        ).exec();

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

    async addMarker(categoryId: string, markerId: string) {
        const category = await this.healthCategoryModel.findOne({id: categoryId}).exec();
        const marker = await this.healthMarkerModel.findOne({id: markerId}).exec();

        if (!category || !marker) {
            throw new Error('Category or Marker not found');
        }

        // Add marker to category if not already present
        if (!(category.healthMarkers as any).includes(marker._id)) {
            (category.healthMarkers as any).push(marker._id);
            await category.save();
        }

        // Add category to marker if not already present
        if (!(marker.healthCategories as any).includes(category._id)) {
            (marker.healthCategories as any).push(category._id);
            await marker.save();
        }

        return this.healthCategoryModel.findOne({id: categoryId}).populate('healthMarkers').exec();
    }

    async removeMarker(categoryId: string, markerId: string) {
        const category = await this.healthCategoryModel.findOne({id: categoryId}).exec();
        const marker = await this.healthMarkerModel.findOne({id: markerId}).exec();

        if (!category || !marker) {
            throw new Error('Category or Marker not found');
        }

        // Remove marker from category
        category.healthMarkers = category.healthMarkers.filter(
            (id) => id.toString() !== marker._id.toString()
        );
        await category.save();

        // Remove category from marker
        marker.healthCategories = marker.healthCategories.filter(
            (id) => id.toString() !== category._id.toString()
        );
        await marker.save();

        return this.healthCategoryModel.findOne({id: categoryId}).populate('healthMarkers').exec();
    }
}
