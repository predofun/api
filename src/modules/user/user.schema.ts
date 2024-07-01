import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Mongoose, SortOrder } from 'mongoose';
import { Store } from '../store/store.schema';
import { Order } from '../order/order.schema';

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

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Store'})
  stores: Store[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Order' })
  orders: Order[];
}

export const UserSchema = SchemaFactory.createForClass(User);
