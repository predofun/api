import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsMongoId,
  IsBoolean,
  IsEnum,
  IsNumber,
} from 'class-validator';

export class CreateProductDto {
  @IsMongoId()
  @IsNotEmpty()
  storeId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  tokenId: string;

  @IsString()
  @IsNotEmpty()
  imageUri: string;

  @IsString()
  @IsNotEmpty()
  quantity: number;

  @IsEnum(['true', 'false'])
  @IsOptional()
  isActive: boolean;

  @IsString()
  @IsNotEmpty()
  sizes: string;

  @IsString()
  @IsNotEmpty()
  price: string;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  price: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsString()
  @IsOptional()
  imageUri: string;

  @IsString()
  @IsOptional()
  sizes: string;

  @IsNumber()
  @IsOptional()
  quantity: number;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
