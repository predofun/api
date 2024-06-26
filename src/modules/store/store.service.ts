import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store, StoreDocument } from './store.schema';
import { CreateStoreDto, UpdateStoreDto } from './dto/store.dto';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
  ) { }

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    return this.create(createStoreDto);
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
