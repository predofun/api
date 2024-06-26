import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Product } from '../product/product.schema';


export type StoreDocument = Store & Document;


@Schema({ timestamps: true })
  
export class Store {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  url: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  })
  product: Product[];
}

export const StoreSchema = SchemaFactory.createForClass(Store);

