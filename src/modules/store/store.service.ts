import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store, StoreDocument } from './store.schema';
import { CreateStoreDto, UpdateStoreDto } from './dto/store.dto';
import { User, UserDocument } from '../user/user.schema';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) { }

  async create(createStoreDto: CreateStoreDto, userId: string): Promise<Store> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const store = await this.storeModel.create({ ...createStoreDto, user: user.id });

    user.stores.push(store.id);
    await user.save();
    return store;
  }

  async findAll(): Promise<Store[]> {
    return await this.storeModel.find()
  }

  async findOne(id: string): Promise<Store> {
    return await this.storeModel.findById(id)
  }

  async update(id: string, updateStoreDto: UpdateStoreDto): Promise<Store> {
    return await this.storeModel.findByIdAndUpdate(id, updateStoreDto, { new: true })
  }

  async delete(id: string): Promise<Store> {
    return await this.storeModel.findByIdAndDelete(id)
  }
}
