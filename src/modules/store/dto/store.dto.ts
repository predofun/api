import { IsString, IsNotEmpty,Validate, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, IsEmail, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { Product } from '../../product/product.schema';

// Custom validator to check if URL ends with 'coinswag.shop'
@ValidatorConstraint({ name: 'isCoinswagShopUrl', async: false })
class IsCoinswagShopUrlConstraint implements ValidatorConstraintInterface {
  validate(url: string, args: ValidationArguments) {
    return url.endsWith('coinswag.shop');
  }

  defaultMessage(args: ValidationArguments) {
    return 'URL must end with "coinswag.shop"';
  }
}

function IsCoinswagShopUrl(validationOptions?: any) {
  return Validate(IsCoinswagShopUrlConstraint, validationOptions);
}

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsCoinswagShopUrl()
  url: string;

  @IsString()
  @IsOptional()
  tokenId: string;

}

export class GetAllProductsDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class UpdateStoreDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  url?: string;

  @IsArray()
  @Type(() => Product)
  @IsOptional()
  product?: Product[];
}
