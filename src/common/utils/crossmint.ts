import { config } from 'dotenv';
import { ENVIRONMENT } from '../configs/environment'

config();
const apiKey = ENVIRONMENT.CROSSMINT.API_KEY;

export async function fundWallet(walletLocator: string) {
  const response = await fetch(
    `https://staging.crossmint.com/api/v1-alpha2/wallets/${walletLocator}/balances`,
    {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey!,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: 5,
        currency: 'usdc'
      })
    }
  );

  return await response.json();
}
// Crossmint's API key

// Wallet locator returned from previous step

export async function getWalletBalance(walletLocator: string) {
  const response = await fetch(
    `https://staging.crossmint.com/api/v1-alpha2/wallets/${walletLocator}/balances?currencies=usdc`,
    {
      method: 'GET',
      headers: {
        'X-API-KEY': apiKey!,
        'Content-Type': 'application/json'
      }
    }
  );

  return await response.json();
}
