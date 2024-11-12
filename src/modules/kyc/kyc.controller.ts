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
  HttpStatus,
  UploadedFile,
  HttpException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/kyc.dto';
import { KYCService } from './kyc.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Gemini } from 'src/common/utils/gemini';

@Controller('kyc')
export class KYCController {
  constructor(
    private kycService: KYCService,
    private readonly geminiService: Gemini,
  ) {}

  @Post('/passport/upload')
  @UseInterceptors(FilesInterceptor('images'))
  create(
    @Body() payload: CreateProductDto,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ): Promise<Array<String>> {
    console.log(images);
    return this.kycService.create(payload, images);
  }

  @Post('/verify')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body('documentType') documentType: string,
  ) {
    try {
      // Upload file to Google Cloud Storage
      console.log(file)
      const uploadResult = await this.geminiService.uploadFile(
        file,
        documentType,
      );
      console.log(uploadResult)

      // Verify document using Gemini AI
      const verificationResult = await this.geminiService.verifyDocument(
        uploadResult.url,
        documentType,
      );

      return {
        file: uploadResult,
        verification: verificationResult,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to process document',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
