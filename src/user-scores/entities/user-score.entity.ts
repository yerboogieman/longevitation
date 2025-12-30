import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

@Schema()
export class UserScore extends Document {

    @Prop({required: true})
    userId: string;

    @Prop({required: true})
    healthMarkerId: string;

    @Prop({type: Object, required: true})
    score: any;
}

export const UserScoreSchema = SchemaFactory.createForClass(UserScore);
