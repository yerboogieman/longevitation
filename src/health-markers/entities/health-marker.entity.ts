import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import {HealthCategory} from '../../health-categories/entities/health-category.entity';

@Schema()
export class HealthMarker extends Document {

    @Prop({required: true, unique: true})
    id: string;

    @Prop({required: true})
    weightingFactor: number;

    @Prop({type: Types.ObjectId, ref: 'HealthCategory', required: true})
    parentCategory: HealthCategory;
}

export const HealthMarkerSchema = SchemaFactory.createForClass(HealthMarker);
