import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store, StoreDocument } from './store.schema';
import {
  CreateStoreDto,
  GetAllProductsDto,
  UpdateStoreDto,
} from './dto/store.dto';
import { User, UserDocument } from '../user/user.schema';
import { Product, ProductDocument } from '../product/product.schema';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(payload: CreateStoreDto, userId: string): Promise<Store> {
    try {
      const user = await this.userModel.findById(userId);

      if (!user) {
        throw new NotFoundException('User not found');
      }
      const store = await this.storeModel.create({
        ...payload,
        user: user.id,
      });

      if (!store) {
        console.log(store);
        throw new NotFoundException(
          'Error in creating store, please try again.',
        );
      }

      await this.userModel.findByIdAndUpdate(user.id, {
        $push: { stores: store.id },
      });
      return store;
    } catch (error) {
      console.log(error.code);
      throw new InternalServerErrorException(
        'Error in creating store, please try again.',
      );
    }
  }
  async findAll(): Promise<Store[]> {
    return await this.storeModel.find();
  }

  async getAllProducts(payload: GetAllProductsDto) {
    const { id } = payload;

    const store = await this.storeModel.findById(id).populate('products');

    return store.products;
  }

  async findOne(id: string): Promise<Store> {
    return await this.storeModel.findById(id).populate('products');
  }

  async update(id: string, updateStoreDto: UpdateStoreDto): Promise<Store> {
    return await this.storeModel.findByIdAndUpdate(id, updateStoreDto, {
      new: true,
    });
  }

  async delete(id: string): Promise<Store> {
    return await this.storeModel.findByIdAndDelete(id);
  }
}
