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
import bs58 from 'bs58'
import { SolanaAgentKit, createSolanaTools } from 'solana-agent-kit';

import { ENVIRONMENT } from 'src/common/configs/environment';


@Injectable()
export class BetService {
  USDC_MINT_ADDRESS_DEVNET: PublicKey;
  USDC_MINT_ADDRESS_MAINNET: PublicKey;
  USDC_MINT_ADDRESS: PublicKey;
  constructor() {
    this.USDC_MINT_ADDRESS_DEVNET = new PublicKey(
      '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
    );
    this.USDC_MINT_ADDRESS_MAINNET = new PublicKey(
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    );
    this.USDC_MINT_ADDRESS =
      ENVIRONMENT.MODE === 'dev'
        ? this.USDC_MINT_ADDRESS_DEVNET
        : this.USDC_MINT_ADDRESS_MAINNET;
  }
  base64ToBS58(base64String) {
    // First convert base64 to Buffer
    const buffer = Buffer.from(base64String, 'base64');
    // Then convert Buffer to base58
    return bs58.encode(buffer);
  }
  async getWalletBalance(walletLocator: string) {
    try {
      const agentWallet = this.base64ToBS58(
        Buffer.from(ENVIRONMENT.AGENT.WALLET, 'base64'),
      );
      console.log(agentWallet);

      const agent = await this.setupAgent(agentWallet);
      const usdcTokenBalance = await agent.getBalanceOther(
        new PublicKey(walletLocator),
        this.USDC_MINT_ADDRESS,
      );
      if (usdcTokenBalance === null) return 0;
      return usdcTokenBalance;
    } catch (error) {
      console.error('Error from getting wallet balance', error);
    }
  }

  async setupAgent(privateKey: string) {
    const agent = new SolanaAgentKit(privateKey, ENVIRONMENT.HELIUS.RPC_URL, {
      OPENAI_API_KEY: 'your-api-key',
    });
    return agent;
  }

  async transferUSDC(from: string, to: PublicKey, amount: number) {
    // Transfer SPL token
    try {
      const fromWallet = this.base64ToBS58(Buffer.from(from, 'base64'));
      console.log(fromWallet);

      const agent = await this.setupAgent(fromWallet);
      const signature = await agent.transfer(
        to,
        amount,
        this.USDC_MINT_ADDRESS,
      );
      return signature;
    } catch (error) {
      console.error('Error from transferring USDC', error);
    }
  }
}
