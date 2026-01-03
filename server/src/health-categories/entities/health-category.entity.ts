import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import {HealthMarker} from '../../health-markers/entities/health-marker.entity';

@Schema({collection: 'healthCategories'})
export class HealthCategory extends Document {

    @Prop({required: true, unique: true})
    id: string;

    @Prop({type: [{type: Types.ObjectId, ref: 'HealthMarker'}], default: []})
    healthMarkers: HealthMarker[];

    @Prop({required: true})
    importance: number;

    async calculateScore(): Promise<number> {

        if (!this.healthMarkers || this.healthMarkers.length === 0) {
            return 0;
        }

        const totalScore = this.healthMarkers.reduce((sum, marker) => {
            return sum + marker.importance;
        }, 0);

        const averageScore = totalScore / this.healthMarkers.length;

        return averageScore * this.importance;
    }
}

export const HealthCategorySchema = SchemaFactory.createForClass(HealthCategory);
