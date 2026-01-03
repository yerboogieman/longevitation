import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {CreateHealthMarkerDto} from './dto/create-health-marker.dto';
import {UpdateHealthMarkerDto} from './dto/update-health-marker.dto';
import {UpdateSingleFieldDto} from '../dto/update-single-field.dto';
import {HealthMarker} from './entities/health-marker.entity';
import {HealthMarkerUtil} from "./health-marker-utils";
import {HealthStat} from "../health-stats/entities/health-stat.entity";
import {HealthCategory} from '../health-categories/entities/health-category.entity';

@Injectable()
export class HealthMarkersService {
    constructor(
        @InjectModel(HealthMarker.name) private healthMarkerModel: Model<HealthMarker>,
        @InjectModel(HealthCategory.name) private healthCategoryModel: Model<HealthCategory>,
    ) {
    }

    async calculateScore(healthMarkerId: string, healthStat: HealthStat): Promise<number> {
        return HealthMarkerUtil.calculateScore(healthMarkerId)
    }

    async create(createHealthMarkerDto: CreateHealthMarkerDto) {
        const createdHealthMarker = new this.healthMarkerModel(createHealthMarkerDto);
        return createdHealthMarker.save();
    }

    async findAll() {
        return this.healthMarkerModel.find().populate('healthCategories').exec();
    }

    async findOne(id: string) {
        return this.healthMarkerModel.findOne({id}).populate('healthCategories').exec();
    }

    async remove(id: string) {
        const marker = await this.healthMarkerModel.findOne({id}).exec();
        if (!marker) {
            return null;
        }

        // Remove this marker from all associated categories
        await this.healthCategoryModel.updateMany(
            {_id: {$in: marker.healthCategories}},
            {$pull: {healthMarkers: marker._id}}
        ).exec();

        return this.healthMarkerModel.findOneAndDelete({id}).exec();
    }

    async update(id: string, updateHealthMarkerDto: UpdateHealthMarkerDto) {
        return this.healthMarkerModel.findOneAndUpdate({id}, updateHealthMarkerDto, {new: true}).exec();
    }

    async updateField(updateSingleFieldDto: UpdateSingleFieldDto) {
        const {id, fieldName, value} = updateSingleFieldDto;
        return this.healthMarkerModel.findOneAndUpdate(
            {id},
            {[fieldName]: value},
            {new: true}
        ).exec();
    }

    async addCategory(markerId: string, categoryId: string) {
        const marker = await this.healthMarkerModel.findOne({id: markerId}).exec();
        const category = await this.healthCategoryModel.findOne({id: categoryId}).exec();

        if (!marker || !category) {
            throw new Error('Marker or Category not found');
        }

        // Add category to marker if not already present
        if (!marker.healthCategories.includes(category._id)) {
            marker.healthCategories.push(category._id);
            await marker.save();
        }

        // Add marker to category if not already present
        if (!category.healthMarkers.includes(marker._id)) {
            category.healthMarkers.push(marker._id);
            await category.save();
        }

        return this.healthMarkerModel.findOne({id: markerId}).populate('healthCategories').exec();
    }

    async removeCategory(markerId: string, categoryId: string) {
        const marker = await this.healthMarkerModel.findOne({id: markerId}).exec();
        const category = await this.healthCategoryModel.findOne({id: categoryId}).exec();

        if (!marker || !category) {
            throw new Error('Marker or Category not found');
        }

        // Remove category from marker
        marker.healthCategories = marker.healthCategories.filter(
            (id) => id.toString() !== category._id.toString()
        );
        await marker.save();

        // Remove marker from category
        category.healthMarkers = category.healthMarkers.filter(
            (id) => id.toString() !== marker._id.toString()
        );
        await category.save();

        return this.healthMarkerModel.findOne({id: markerId}).populate('healthCategories').exec();
    }
}
