import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { StoreService } from './store.service';
import {
  CreateStoreDto,
  GetAllProductsDto,
  UpdateStoreDto,
} from './dto/store.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { LoggedInUserDecorator } from 'src/common/decorators/logged_in_user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { RESPONSE_CONSTANT } from 'src/common/constants/response.constant';
import { StoreDocument } from './store.schema';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  // @UseInterceptors(FileInterceptor('file'))
  @ResponseMessage(RESPONSE_CONSTANT.STORE.CREATE_STORE_SUCCESS)
  @UseGuards(JwtAuthGuard)
  create(
    @Body() payload: CreateStoreDto,
    // @UploadedFile() file: Express.Multer.File,
    @LoggedInUserDecorator() user: { id: string },
  ) {
    return this.storeService.create(payload, user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  // @ResponseMessage(RESPONSE_CONSTANT.STORE.GET_ALL_STORES_SUCCESS)
  findAll() {
    return this.storeService.findAll();
  }

  @Get('/find')
  @Public()
  findByStoreName(@Query('name') name: string): Promise<StoreDocument> {
    return this.storeService.findByStoreName(name);
  }

  @Get(':id')
  @Public()
  @ResponseMessage(RESPONSE_CONSTANT.STORE.GET_STORE_SUCCESS)
  findOne(@Param('id') id: string) {
    return this.storeService.findOne(id);
  }

  @Get(':id/products')
  @Public()
  @ResponseMessage(RESPONSE_CONSTANT.STORE.GET_ALL_PRODUCTS_SUCCESS)
  getAllProducts(@Param() payload: GetAllProductsDto) {
    return this.storeService.getAllProducts(payload);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage(RESPONSE_CONSTANT.STORE.UPDATE_STORE_SUCCESS)
  update(@Param('id') id: string, @Body() payload: UpdateStoreDto) {
    return this.storeService.update(id, payload);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage(RESPONSE_CONSTANT.STORE.DELETE_STORE_SUCCESS)
  remove(@Param('id') id: string) {
    return this.storeService.delete(id);
  }
}
