import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SigninMethods } from '../../common/enum/auth.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class ServiceProvider {
    @Prop({ type: String, enum: SigninMethods, required: true })
    inp: SigninMethods;  // Integrated Provider (Google, Facebook, etc.)

    @Prop({ type: String, required: true })
    pId: string;  // Provider ID

    @Prop({ type: Object, default: {} }) // Optional extra data
    extra?: Record<string, any>;
}

@Schema({ timestamps: true })
export class User {
    @Prop({ type: String })
    nm: string;

    @Prop({ type: String, unique: true, required: true })
    email: string;

    @Prop({ type: [ServiceProvider], default: [] }) // Embedded service providers
    sp: ServiceProvider[];

    @Prop({ type: String })
    dp: string; // Profile Picture
}

export const UserSchema = SchemaFactory.createForClass(User);
