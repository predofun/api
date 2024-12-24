import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KYCModule } from './modules/kyc/kyc.module';
import { BetModule } from './modules/bet/bet.module';

@Module({
  imports: [KYCModule, BetModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
