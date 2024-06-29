import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './cart.schema';
import { CartService } from './cart.service';
import { UserModule } from '../user/user.module';
import { User, UserSchema } from '../user/user.schema';
import { Product, ProductSchema } from '../product/product.schema';
import { CartController } from './cart.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    UserModule,
  ],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}
