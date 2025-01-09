import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import { BetService } from './bet.service';
import { MongoClient } from 'mongodb';
import { PublicKey } from '@solana/web3.js';
import { Queue, Worker } from 'bullmq';
import { ENVIRONMENT } from 'src/common/configs/environment';
import { SolanaService, sponsorTransferUSDC } from 'src/common/utils/solana';

interface VoteDto {
  betId: string;
  username: string;
  votedOption: string;
}

interface VoteDto {
  betId: string;
  username: string;
  votedOption: string;
}

@Controller('bet')
export class BetController {
  private transferQueue: Queue;

  constructor(
    private readonly betService: BetService,
    private readonly mongoClient: MongoClient,
  ) {
    // Initialize BullMQ queue
    this.transferQueue = new Queue('transferQueue', {
      connection: {
        url: ENVIRONMENT.REDIS.URL,
      },
    });

    // Worker to process the transfer jobs
    new Worker(
      'transferQueue',
      async (job) => {
        const { senderPrivateKey, recipient, amount, userId, votedOption } =
          job.data;

        const result = await sponsorTransferUSDC(
          senderPrivateKey,
          new PublicKey(recipient),
          amount,
        );

        if (result.success) {
          // Update database after successful transfer
          const betsCollection = this.mongoClient.db('test').collection('bets');
          await betsCollection.findOneAndUpdate(
            { betId: job.data.betId },
            {
              $addToSet: {
                participants: userId,
              },
              $set: {
                [`votes.${userId}`]: votedOption,
              },
            },
          );
          return { success: true, message: 'Transfer processed successfully' };
        } else {
          throw new Error('Transfer failed');
        }
      },
      {
        connection: {
          url: ENVIRONMENT.REDIS.URL,
        },
      },
    );
  }

  @Post('predict')
  async voteBet(@Body() voteDto: VoteDto) {
    const { betId, username, votedOption } = voteDto;

    try {
      const betsCollection = this.mongoClient.db('test').collection('bets');
      const userWalletsCollection = this.mongoClient
        .db('test')
        .collection('userwallets');

      const bet = await betsCollection.findOne({ betId });
      if (!bet) {
        throw new HttpException('Bet not found', HttpStatus.NOT_FOUND);
      }

      const currentTime = new Date();
      if (new Date(bet.endTime) < currentTime) {
        throw new HttpException(
          'Bet has already closed',
          HttpStatus.BAD_REQUEST,
        );
      }

      const userWallet = await userWalletsCollection.findOne({ username });
      if (!userWallet) {
        throw new HttpException('User wallet not found', HttpStatus.NOT_FOUND);
      }

      const solana = new SolanaService();
      const balance = await solana.getUSDCBalance(userWallet.address);
      if (balance < bet.minAmount) {
        throw new HttpException(
          'Insufficient balance to place bet',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (
        !bet.options.some(
          (option) => option.toLowerCase() === votedOption.toLowerCase(),
        )
      ) {
        throw new HttpException(
          'Invalid voting option',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Add transfer job to the queue
      await this.transferQueue.add('transfer', {
        senderPrivateKey: userWallet.privateKey,
        recipient: ENVIRONMENT.AGENT.PUBLIC_KEY,
        amount: bet.minAmount,
        betId,
        userId: userWallet._id,
        votedOption,
      });

      return {
        message: 'Vote queued successfully. Processing in the background.',
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'An error occurred while processing the vote',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('user')
  async getUserWalletByUsername(@Query('username') username: string) {
    try {
      const userWalletsCollection = this.mongoClient
        .db('test')
        .collection('userwallets');
      const userWallet = await userWalletsCollection.findOne({ username });
      if (!userWallet) {
        throw new HttpException('User wallet not found', HttpStatus.NOT_FOUND);
      }
      return { ...userWallet, privateKey: undefined };
    } catch (error) {
      throw new HttpException(
        error.message || 'An error occurred while fetching the user wallet',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // @Get('fix')
  // async fixMistake() {
  //   try {
  //     const userWalletsCollection = this.mongoClient
  //       .db('test')
  //       .collection('userwallets');
  //     const jsonData = JSON.parse(
  //       readFileSync(
  //         `C:\\Users\\USER\\Documents\\Code\\ICP\\oneid-api\\src\\modules\\bet\\test.userwallets.json`,
  //         'utf-8',
  //       ),
  //     );
  //     // return jsonData;
  //     await Promise.all(
  //       jsonData.map(async (userWallet: any) => {
  //         const newPrivateKey = encrypt(userWallet.privateKey);
  //         await userWalletsCollection.updateOne(
  //           { username: userWallet.username },
  //           { $set: { privateKey: newPrivateKey } },
  //         );
  //         console.log(`${userWallet.username} private key has been restored`);
  //       }),
  //     ).then(() => console.log('User wallets have been fixed'));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  @Get(':betId')
  async getBetById(@Param('betId') betId: string) {
    try {
      const betsCollection = this.mongoClient.db('test').collection('bets');
      const bet = await betsCollection.findOne({ betId });
      if (!bet) {
        throw new HttpException('Bet not found', HttpStatus.NOT_FOUND);
      }
      return bet;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        error.message || 'An error occurred while fetching the bet',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
