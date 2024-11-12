import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KYCModule } from './modules/kyc/kyc.module';

@Module({
  imports: [KYCModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
