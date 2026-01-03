import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import {HealthMarkerUtil} from "../../health-markers/health-marker-utils";

@Schema({collection: 'healthStats'})
export class HealthStat extends Document {

    @Prop({required: true})
    userId: string;

    @Prop({required: true})
    healthMarkerId: string;

    @Prop({type: Object, required: true})
    data: any;

    calculateScore(): number {
        return HealthMarkerUtil.calculateScore(this.healthMarkerId, this.data);
    }
}

export const HealthStatSchema = SchemaFactory.createForClass(HealthStat);
