import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsMongoId,
  IsBoolean,
  IsEnum,
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
  sizes: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
