import {
  Controller,
  UseGuards,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { ProductService } from './product.service';
import { ProductDocument } from './product.schema';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  @UseGuards(JwtAuthGuard)
  create(
    @Body() payload: CreateProductDto,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ): Promise<ProductDocument> {
    console.log(images);
    return this.productService.create(payload, images);
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
  update(
    @Param('id') id: string,
    @Body() payload: UpdateProductDto,
  ): Promise<ProductDocument | null> {
    return this.productService.update(id, payload);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string): Promise<ProductDocument | null> {
    return this.productService.delete(id);
  }
}
