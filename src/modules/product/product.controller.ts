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
import { CreateProductDto, } from './dto/product.dto';
import { ProductService } from './product.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('upload')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  create(
    @Body() payload: CreateProductDto,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ): Promise<Array<String>> {
    console.log(images);
    return this.productService.create(payload, images);
  }

}
