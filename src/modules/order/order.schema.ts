import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Store } from '../store/store.schema';
import { Cart } from '../cart/cart.schema';
import { Customer } from '../customer/customer.schema';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  orderId: string;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ required: true, unique: true })
  tokenId: string;

  @Prop({ required: true })
  status: string;

  @Prop({ default: 'USD' })
  currency: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' })
  customer: Customer;

  @Prop(
    raw({
      address: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
      },
      trackingNumber: String,
    }),
  )
  shippingInfo: Record<string, any>;

  @Prop(
    raw({
      subtotal: Number,
      tax: {
        type: Number,
        default: 2,
      },
      shippingCost: Number,
      discount: Number,
      total: Number,
    }),
  )
  priceBreakdown: Record<string, any>;

  @Prop({ type: String })
  txhash: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true })
  cart: Cart;

  @Prop({ required: true })
  orderDate: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true })
  store: Store;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
