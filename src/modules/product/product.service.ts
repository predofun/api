import { Injectable } from '@nestjs/common';
import { Product, ProductDocument } from './product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { Model } from 'mongoose';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) { }

  async create(createProductDto: CreateProductDto): Promise<ProductDocument> {
    const createdProduct = new this.productModel(createProductDto);
    return await createdProduct.save();
  }

  async findAll(): Promise<ProductDocument[]> {
    return await this.productModel.find();
  }

  async findOne(id: string): Promise<ProductDocument | null> {
    return await this.productModel.findById(id);
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductDocument | null> {
    return await this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true });
  }

  async delete(id: string): Promise<ProductDocument | null> {
    return await this.productModel.findByIdAndDelete(id);
  }

}
