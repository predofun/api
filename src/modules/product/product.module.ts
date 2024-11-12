import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
