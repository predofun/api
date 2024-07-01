import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order, OrderSchema } from './order.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreModule } from '../store/store.module';
import { Store, StoreSchema } from '../store/store.schema';
import { Cart, CartSchema } from '../cart/cart.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Store.name, schema: StoreSchema },
      { name: Cart.name, schema: CartSchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
