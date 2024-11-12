import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProductDto } from './dto/kyc.dto';
import { Model } from 'mongoose';
import { uploadFiles } from 'src/common/utils/cloudinary';
@Injectable()
export class KYCService {
  constructor() {}

  async create(
    payload: CreateProductDto,
    images: Array<Express.Multer.File>,
  ): Promise<Array<String>> {
    try {
      if (!images)
        throw new BadRequestException('Please upload at least one image');

      const uploadedImages = await uploadFiles(`OneID`, images);

      const imageUrls = uploadedImages.map((image: any) => image.secure_url);

      return imageUrls;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Product already exists');
      }
    }
  }
}
