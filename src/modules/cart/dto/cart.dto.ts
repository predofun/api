import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Product } from '../../product/product.schema';

export interface Item {
  product: Product;
  size: string;
}
export class CreateCartDto {
  @IsString()
  @IsNotEmpty()
  walletAddress: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  @IsNotEmpty()
  items: Item[];
}

export class GetCartDto {
  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}

export class UpdateCartDto {
  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  @IsOptional()
  items?: Item[];
}
