import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';

export interface Item {
  product: string;
  size: string;
  quantity: number;
}
export class CreateCartDto {
  @IsString()
  @IsNotEmpty()
  walletAddress: string;

  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  store: string;

  @IsArray()
  // @ValidateNested({ each: true })
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
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Object)
  @IsOptional()
  items?: Item[];
}
