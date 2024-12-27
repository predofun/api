import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { CreateBetDto } from './dto/create-bet.dto';
import { UpdateBetDto } from './dto/update-bet.dto';
import {
  LAMPORTS_PER_SOL,
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} from '@solana/web3.js';

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
const SOL_TO_USDC = 181 / LAMPORTS_PER_SOL;
const USDC_TO_SOL = (1 / 181) * LAMPORTS_PER_SOL;

@Injectable()
export class BetService {
  constructor() {}

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
  async getWalletBalance(walletLocator: string) {
    console.log(walletLocator);
    const balance = await connection.getBalance(new PublicKey(walletLocator));
    console.log(balance);
    if (!balance) return 0;
    const balanceUsdc = balance * SOL_TO_USDC;
    console.log(balanceUsdc);
    return balanceUsdc.toFixed(2);
  }
  async transfer(privateKeyFrom: string, publicKey: PublicKey, amount: number) {
    const fromKeypair = Keypair.fromSecretKey(
      Buffer.from(privateKeyFrom, 'base64'),
    );
    console.log(amount / SOL_TO_USDC);
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromKeypair.publicKey,
        toPubkey: publicKey,
        lamports: amount * USDC_TO_SOL,
      }),
    );
    await sendAndConfirmTransaction(connection, transaction, [fromKeypair]);
  }
}
