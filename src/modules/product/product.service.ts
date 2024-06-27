import { BadRequestException, Injectable } from '@nestjs/common';
import { Product, ProductDocument } from './product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { Model } from 'mongoose';
import { uploadFiles } from 'src/common/utils/cloudinary';
import { StoreService } from '../store/store.service';
import { Store, StoreDocument } from '../store/store.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
  ) {}

  async create(
    payload: CreateProductDto,
    files: Express.Multer.File[],
  ): Promise<ProductDocument> {
    const { storeId } = payload;

    const store = await this.storeModel.findById(storeId);

    if (!storeId) throw new BadRequestException('Store not found');

    const images = await uploadFiles('products', files);

    const imageUrls = images.map((image: any) => image.secure_url);

    const createdProduct = await this.productModel.create({
      ...payload,
      images: imageUrls,
    });

    store.products.push(createdProduct);
    await store.save();

    return createdProduct;
  }

  async findAll(): Promise<ProductDocument[]> {
    return await this.productModel.find();
  }

  async findOne(id: string): Promise<ProductDocument | null> {
    return await this.productModel.findById(id);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductDocument | null> {
    return await this.productModel.findByIdAndUpdate(id, updateProductDto, {
      new: true,
    });
  }

  async delete(id: string): Promise<ProductDocument | null> {
    return await this.productModel.findByIdAndDelete(id);
  }
}
