import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto, GetCartDto, UpdateCartDto } from './dto/cart.dto';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { RESPONSE_CONSTANT } from 'src/common/constants/response.constant';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ResponseMessage(RESPONSE_CONSTANT.CART.CREATE_CART_SUCCESS)
  create(@Body() payload: CreateCartDto) {
    return this.cartService.create(payload);
  }

  @Get()
  @ResponseMessage(RESPONSE_CONSTANT.CART.GET_ALL_CART_ITEMS_SUCCESS)
  findAllProducts(@Param() payload: GetCartDto) {
    return this.cartService.getAllProducts(payload);
  }

  @Get(':id')
  @ResponseMessage(RESPONSE_CONSTANT.CART.GET_CART_SUCCESS)
  findOne(@Param() payload: GetCartDto) {
    return this.cartService.getCartById(payload);
  }

  @Get(':id/products')
  @ResponseMessage(RESPONSE_CONSTANT.CART.GET_ALL_CART_ITEMS_SUCCESS)
  getAllProducts(@Param() payload: GetCartDto) {
    return this.cartService.getAllProducts(payload);
  }

  @Put(':id')
  @ResponseMessage(RESPONSE_CONSTANT.CART.UPDATE_CART_SUCCESS)
  update(@Param('id') id: string, @Body() payload: UpdateCartDto) {
    return this.cartService.update(id, payload);
  }

  @Delete(':id')
  @ResponseMessage(RESPONSE_CONSTANT.CART.DELETE_CART_SUCCESS)
  remove(@Param('id') id: string) {
    return this.cartService.delete(id);
  }
}
