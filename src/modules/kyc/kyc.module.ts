import { Module } from '@nestjs/common';
import { KYCService } from './kyc.service';
import { KYCController } from './kyc.controller';
import { Gemini } from 'src/common/utils/gemini';

@Module({
  controllers: [KYCController],
  providers: [KYCService, Gemini],
})
export class KYCModule {}
