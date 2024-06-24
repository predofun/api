import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop()
  username: string;

  @Prop({})
  email: string;

  @Prop({ required: true, enum: ['local', 'google'], default: 'local' })
  type: string;

  @Prop({ select: false })
  password: string;

  @Prop()
  walletAddress: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
