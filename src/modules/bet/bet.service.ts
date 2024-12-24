import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { CreateBetDto } from './dto/create-bet.dto';
import { UpdateBetDto } from './dto/update-bet.dto';

@Injectable()
export class BetService {
  constructor(
  ) {}

  create(createBetDto: CreateBetDto) {
    return 'This action adds a new bet';
  }

  findAll() {
    return `This action returns all bet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bet`;
  }

  update(id: number, updateBetDto: UpdateBetDto) {
    return `This action updates a #${id} bet`;
  }

  remove(id: number) {
    return `This action removes a #${id} bet`;
  }

  async voteBet(betId: string, username: string, votedOption: string) {
    // const betsCollection = this.mongoClient.db('predo').collection('bets');
    // const userWalletsCollection = this.mongoClient.db('predo').collection('userwallets');

    // Perform validations and update bet
    // Similar logic to what's in the controller
  }
}
