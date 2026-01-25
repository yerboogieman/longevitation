import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {BaseDocument} from '@customation/model/document';

@Schema({
    collection: 'healthStats',
    timeseries: {
        timeField: 'timestamp',
        metaField: 'metadata',
        granularity: 'hours',
    },
})
export class HealthStat extends BaseDocument {

    @Prop({required: true})
    timestamp: Date;

    @Prop({type: Object, required: true})
    metadata: {
        userId: string;
        healthMarkerId: string;
    };

    @Prop({type: Object, required: true})
    data: any;
}

export const HealthStatSchema = SchemaFactory.createForClass(HealthStat);
