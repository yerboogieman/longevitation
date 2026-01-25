import {readdirSync, readFileSync} from 'fs';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {CreateHealthMarkerDto} from './dto/create-health-marker.dto';
import {UpdateHealthMarkerDto} from './dto/update-health-marker.dto';
import {UpdateSingleFieldDto} from '../dto/update-single-field.dto';
import {HealthMarker} from './entities/health-marker.entity';
import {HealthStat} from "../health-stats/entities/health-stat.entity";
import {HealthStatsService} from "../health-stats/health-stats.service";
import {HealthCategory} from '../health-categories/entities/health-category.entity';
import nools from "nools";
import path from "path";

@Injectable()
export class HealthMarkersService {

    constructor(
        @InjectModel(HealthMarker.name) private healthMarkerModel: Model<HealthMarker>,
        @InjectModel(HealthCategory.name) private healthCategoryModel: Model<HealthCategory>,
        private healthStatsService: HealthStatsService,
    ) {}

    async evaluateMarkerData(healthMarkerId: string, healthStat: HealthStat, ruleFolderPath: string): Promise<any> {

        let noolsFilePath = path.join(__dirname, ruleFolderPath, `${healthMarkerId}.nools`);
        const typeName = await this.extractNoolsTypeName(noolsFilePath);
        if (!typeName) {
            throw new Error(`Could not extract type name from ${noolsFilePath}`);
        } else if (typeName === "BloodPressure") {
            typeName.startsWith(">")
        }

        const flow = nools.compile(noolsFilePath);
        const MarkerEval = flow.getDefined(typeName);
        const ScoreResult = flow.getDefined("ScoreResult");

        const markerEval = new MarkerEval(healthStat.data);

        const result = new ScoreResult();
        const session = flow.getSession(markerEval, result);

        await session.match();
        session.dispose();

        return result;
    }

    async evaluateMarkerDataForCategory(categoryName: string): Promise<any[]> {

        const ruleFolderPath = `../rules/health-markers/${categoryName}`;
        const fullPath = path.join(__dirname, ruleFolderPath);

        const files = readdirSync(fullPath);
        const markerIds = files
            .filter(file => file.endsWith('.nools'))
            .map(file => file.replace('.nools', ''));

        const results: any[] = [];

        for (const markerId of markerIds) {
            const healthStat = await this.healthStatsService.findLatest(markerId);
            if (healthStat) {
                const result = await this.evaluateMarkerData(markerId, healthStat, ruleFolderPath);
                results.push({ value: healthStat.data, markerId, ...result });
            }
        }

        return results;
    }

    async create(createHealthMarkerDto: CreateHealthMarkerDto) {
        const createdHealthMarker = new this.healthMarkerModel(createHealthMarkerDto);
        return createdHealthMarker.save();
    }

    async extractNoolsTypeName(filePath: string): Promise<string> {

        const content = readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');

        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('define ')) {
                const match = trimmed.match(/^define\s+(\w+)/);
                if (match) {
                    return match[1];
                }
            }
        }

        return "";
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
            {_id: {$in: marker.healthCategories as any}},
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
        if (!(marker.healthCategories as any).includes(category._id)) {
            (marker.healthCategories as any).push(category._id);
            await marker.save();
        }

        // Add marker to category if not already present
        if (!(category.healthMarkers as any).includes(marker._id)) {
            (category.healthMarkers as any).push(marker._id);
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

        // Remove category from the marker
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
