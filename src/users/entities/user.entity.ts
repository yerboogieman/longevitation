import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

@Schema()
export class User extends Document {

    @Prop({required: true, unique: true})
    id: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
