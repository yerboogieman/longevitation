import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import {HealthMarker} from '../../health-markers/entities/health-marker.entity';

@Schema()
export class HealthCategory extends Document {

    @Prop({required: true, unique: true})
    id: string;

    @Prop({type: [{type: Types.ObjectId, ref: 'HealthMarker'}], default: []})
    healthMarkers: HealthMarker[];

    @Prop({required: true})
    weightingFactor: number;

    async getScore(): Promise<number> {

        if (!this.healthMarkers || this.healthMarkers.length === 0) {
            return 0;
        }

        const totalScore = this.healthMarkers.reduce((sum, marker) => {
            return sum + marker.weightingFactor;
        }, 0);

        const averageScore = totalScore / this.healthMarkers.length;

        return averageScore * this.weightingFactor;
    }
}

export const HealthCategorySchema = SchemaFactory.createForClass(HealthCategory);
