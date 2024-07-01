import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Product } from '../product/product.schema';
import { User } from '../user/user.schema';
import { Customer } from '../customer/customer.schema';

export type StoreDocument = Store & Document;

@Schema({ timestamps: true })
export class Store {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  url: string;

  @Prop({ required: true, unique: true })
  owner: string;

  @Prop({ required: true, unique: true })
  tokenId: string;

  @Prop({ required: true, unique: true })
  storeAddress: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  })
  products: Product[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }],
  })
  customers: Customer[];
}

export const StoreSchema = SchemaFactory.createForClass(Store);
