import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
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

      const balance = await this.betService.getWalletBalance(
        userWallet.address,
      );
      console.log(balance);
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
      await this.betService.transfer(
        userWallet.privateKey,
        new PublicKey(ENVIRONMENT.AGENT.WALLET),
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
      throw new HttpException(
        error.message || 'An error occurred while fetching the bet',
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
}
