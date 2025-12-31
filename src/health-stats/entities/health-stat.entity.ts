import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

@Schema()
export class HealthStat extends Document {

    @Prop({required: true})
    userId: string;

    @Prop({required: true})
    healthMarkerId: string;

    @Prop({type: Object, required: true})
    score: any;

    getScore(): number {
        return this.score.score;
    }
}

export const HealthStatSchema = SchemaFactory.createForClass(HealthStat);
