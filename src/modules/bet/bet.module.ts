import { Module, OnModuleDestroy } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { BetService } from './bet.service';
import { BetController } from './bet.controller';
import { ENVIRONMENT } from '../../common/configs/environment';

@Module({
  controllers: [BetController],
  providers: [
    BetService,
    {
      provide: MongoClient,
      useFactory: async () => {
        // Use a default connection string if not specified in environment
        const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/predo';
        const client = new MongoClient(connectionString);
        await client.connect();
        return client;
      },
      inject: []
    }
  ],
})
export class BetModule implements OnModuleDestroy {
  constructor(private readonly mongoClient: MongoClient) {}

  async onModuleDestroy() {
    await this.mongoClient.close();
  }
}
