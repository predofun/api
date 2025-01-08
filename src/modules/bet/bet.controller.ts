import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { BetService } from './bet.service';
import { MongoClient } from 'mongodb';
import { PublicKey } from '@solana/web3.js';
import { ENVIRONMENT } from 'src/common/configs/environment';
import { readFileSync } from 'fs';
import { solanaService, sponsorTransferUSDC } from 'src/common/utils/solana';

interface VoteDto {
  betId: string;
  username: string;
  votedOption: string;
}

@Controller('bet')
export class BetController {
  constructor(
    private readonly betService: BetService,
    private readonly mongoClient: MongoClient,
  ) {}

  @Post('predict')
  async voteBet(@Body() voteDto: VoteDto) {
    const { betId, username, votedOption } = voteDto;
    console.log(voteDto);

    try {
      // 1. Find the bet
      const betsCollection = this.mongoClient.db('test').collection('bets');
      const userWalletsCollection = this.mongoClient
        .db('test')
        .collection('userwallets');

      const bet = await betsCollection.findOne({ betId });
      if (!bet) {
        throw new HttpException('Bet not found', HttpStatus.NOT_FOUND);
      }

      // 2. Check if bet is still open
      const currentTime = new Date();
      if (new Date(bet.endTime) < currentTime) {
        throw new HttpException(
          'Bet has already closed',
          HttpStatus.BAD_REQUEST,
        );
      }

      // 3. Find user's wallet
      console.log('username', username);
      const userWallet = await userWalletsCollection.findOne({ username });
      console.log(userWallet);
      const solana = new solanaService();
      console.log(solana)
      const balance = await solana.getUSDCBalance(userWallet.address);
      console.log('balance', balance, 'USDC');
      if (!userWallet) {
        throw new HttpException('User wallet not found', HttpStatus.NOT_FOUND);
      }

      // 4. Check wallet balance
      if (balance < bet.minAmount) {
        throw new HttpException(
          'Insufficient balance to place bet',
          HttpStatus.BAD_REQUEST,
        );
      }

      // 5. Check if option is valid
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

      await sponsorTransferUSDC(
        userWallet.privateKey,
        new PublicKey(ENVIRONMENT.AGENT.PUBLIC_KEY),
        bet.minAmount,
      );
      // 6. Update bet participants and votes
      const updatedBet = await betsCollection.findOneAndUpdate(
        { betId },
        {
          $addToSet: {
            participants: userWallet._id,
          },
          $set: {
            [`votes.${userWallet._id}`]: votedOption,
          },
        },
        { returnDocument: 'after' },
      );

      return {
        message: 'Vote placed successfully',
        bet: updatedBet,
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
