import { Controller, UseGuards, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { ProductService } from './product.service'; 
import { ProductDocument } from './product.schema';


@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) { }
  
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createProductDto: CreateProductDto): Promise<ProductDocument> {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(): Promise<ProductDocument[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ProductDocument | null> {
    return this.productService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto): Promise<ProductDocument | null> {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string): Promise<ProductDocument | null> {
    return this.productService.delete(id);
  }
}
