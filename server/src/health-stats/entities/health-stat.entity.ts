import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {BaseDocument} from '@customation/model';
import {HealthMarkerUtil} from "../../health-markers/health-marker-utils";

@Schema({collection: 'healthStats'})
export class HealthStat extends BaseDocument {

    @Prop({required: true})
    userId: string;

    @Prop({required: true})
    healthMarkerId: string;

    @Prop({type: Object, required: true})
    data: any;

    calculateScore(): number {
        return HealthMarkerUtil.calculateScore(this.healthMarkerId, this.data);
    }

    static fromJson(json: any): HealthStat {
        const healthStat = new HealthStat();
        healthStat.userId = json.userId;
        healthStat.healthMarkerId = json.healthMarkerId;
        healthStat.data = json.data;
        return healthStat;
    }

    toJson(): any {
        return {
            userId: this.userId,
            healthMarkerId: this.healthMarkerId,
            data: this.data,
        };
    }
}

export const HealthStatSchema = SchemaFactory.createForClass(HealthStat);
