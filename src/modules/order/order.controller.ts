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
import { CreateOrderDto } from './dto/order.dto';
import { OrderService } from './order.service';
import { OrderDocument } from './order.schema';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  @Public()
  create(@Body() payload: CreateOrderDto): Promise<OrderDocument> {
    return this.orderService.create(payload);
  }

  @Get()
  findAll(): Promise<OrderDocument[]> {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<OrderDocument | null> {
    return this.orderService.findOne(id);
  }

  @Get('store/:storeId')
  findByStoreId(@Param('storeId') storeId: string): Promise<OrderDocument[]> {
    return this.orderService.findByStoreId(storeId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string): Promise<OrderDocument | null> {
    return this.orderService.delete(id);
  }
}
