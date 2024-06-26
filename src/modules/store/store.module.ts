import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Store, StoreSchema } from './store.schema';
import { StoreService } from './store.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Store.name, schema: StoreSchema }]), UserModule],
  providers: [StoreService],
  controllers: [StoreController],
  exports: [StoreService]
})
export class StoreModule {}
