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
} from '@nestjs/common';
import { BetService } from './bet.service';
import { MongoClient } from 'mongodb';

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
      const userWallet = await userWalletsCollection.findOne({ username });
      const balance = await this.betService.getWalletBalance(
        userWallet.walletLocator,
      );
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
      if (!bet.options.includes(votedOption)) {
        throw new HttpException(
          'Invalid voting option',
          HttpStatus.BAD_REQUEST,
        );
      }

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
}
