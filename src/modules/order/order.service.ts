import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Order, OrderDocument } from './order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateOrderDto } from './dto/order.dto';
import { Model } from 'mongoose';
import { uploadFiles } from 'src/common/utils/cloudinary';
import { StoreService } from '../store/store.service';
import { Store, StoreDocument } from '../store/store.schema';
import { Cart, CartDocument } from '../cart/cart.schema';
import { Product } from '../product/product.schema';
import { Customer, CustomerDocument } from '../customer/customer.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
  ) {}

  async create(payload: CreateOrderDto): Promise<OrderDocument> {
    const {
      storeId,
      totalAmount,
      tokenId,
      customer,
      shippingInfo,
      priceBreakdown,
      txhash,
      cart,
    } = payload;

    try {
      const store = await this.storeModel.findById(storeId);

      if (!store) throw new BadRequestException('Store not found');

      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
      const status = 'pending';
      const orderDate = new Date();
      const existingCustomer = await this.customerModel.findOne({
        email: customer.email,
      });
      const newCustomer =
        existingCustomer ?? (await this.customerModel.create(customer));

      // Calculate the total amount of the cart items
      const createdOrder = await this.orderModel.create({
        orderId,
        totalAmount,
        tokenId,
        status,
        currency: 'USD', // Default currency
        customer: newCustomer._id,
        shippingInfo,
        priceBreakdown,
        cart,
        txhash,
        orderDate,
        store: storeId,
      });

      await this.storeModel.findByIdAndUpdate(store.id, {
        $push: { orders: createdOrder._id, customers: newCustomer._id },
      });

      return createdOrder;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Order already exists');
      }
    }
  }

  async findAll(): Promise<OrderDocument[]> {
    return await this.orderModel.find();
  }

  async findOne(id: string): Promise<OrderDocument | null> {
    return await this.orderModel.findById(id);
  }

  async findByStoreId(storeId: string): Promise<OrderDocument[]> {
    return await this.orderModel.find({ store: storeId });
  }

  async delete(id: string): Promise<OrderDocument | null> {
    return await this.orderModel.findByIdAndDelete(id);
  }
}
