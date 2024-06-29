import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Product } from '../product/product.schema';
import { User } from '../user/user.schema';
import { Store } from '../store/store.schema';

export type CartDocument = Cart & Document;

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true })
  store: Store;

  @Prop({ required: true, unique: true })
  walletAddress: string;

  @Prop(
    raw([
      {
        product: Product,
        size: String,
        quantity: { type: Number, default: 1 },
      },
    ]),
  )
  items: Record<string, any>;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
