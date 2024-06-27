import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Store } from '../store/store.schema';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  sizes: string[];

  @Prop({ required: true })
  images: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true })
  store: Store;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
