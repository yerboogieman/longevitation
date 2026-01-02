import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {CreateHealthMarkerDto} from './dto/create-health-marker.dto';
import {UpdateHealthMarkerDto} from './dto/update-health-marker.dto';
import {UpdateSingleFieldDto} from '../dto/update-single-field.dto';
import {HealthMarker} from './entities/health-marker.entity';
import {HealthMarkerUtil} from "./health-marker-utils";
import {HealthStat} from "../health-stats/entities/health-stat.entity";

@Injectable()
export class HealthMarkersService {
    constructor(
        @InjectModel(HealthMarker.name) private healthMarkerModel: Model<HealthMarker>,
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
        return this.healthMarkerModel.find().exec();
    }

    async findOne(id: string) {
        return this.healthMarkerModel.findOne({id}).exec();
    }

    async remove(id: string) {
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
}
