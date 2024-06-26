import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Store, StoreSchema } from './store.schema';
import { StoreService } from './store.service';
import { UserModule } from '../user/user.module';
import { User, UserSchema } from '../user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Store.name, schema: StoreSchema },
      { name: User.name, schema: UserSchema },
    ]),
    UserModule,
  ],
  providers: [StoreService],
  controllers: [StoreController],
  exports: [StoreService],
})
export class StoreModule {}
