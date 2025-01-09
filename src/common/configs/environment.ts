import * as dotenv from 'dotenv';
dotenv.config();

export interface IEnvironment {
  APP: {
    NAME: string;
    PORT: number;
    ENV: string;
  };
  DB: {
    URL: string;
  };
  JWT: {
    SECRET: string;
  };
  GOOGLE: {
    CLOUD: {
      API_KEY: string;
    };
    CLIENT: {
      ID: string;
    };
    GEMINI: {
      API_KEY: string;
    };
  };
  CLOUDINARY: {
    CLOUD_NAME: string;
    API_KEY: string;
    API_SECRET: string;
  };
  APITOOLKIT: {
    API_KEY: string;
  };
  CROSSMINT: {
    API_KEY: string;
  };
  AGENT: {
    WALLET: string;
    PUBLIC_KEY: string;
  };
  MODE: string;
  HELIUS: {
    RPC_URL: string;
  };
  ENCRYPTION: {
    KEY: string;
  };
  FEE_PAYER: string;
}

export const ENVIRONMENT: IEnvironment = {
  APP: {
    NAME: process.env.APP_NAME,
    PORT: Number(process.env.PORT),
    ENV: process.env.APP_ENV,
  },
  DB: {
    URL: process.env.DB_URL,
  },
  JWT: {
    SECRET: process.env.JWT_SECRET,
  },
  GOOGLE: {
    CLOUD: {
      API_KEY: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    },
    CLIENT: {
      ID: process.env.GOOGLE_CLIENT_ID,
    },
    GEMINI: {
      API_KEY: process.env.GEMINI_API_KEY,
    },
  },
  CLOUDINARY: {
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
    API_KEY: process.env.CLOUDINARY_CLOUD_API_KEY!,
    API_SECRET: process.env.CLOUDINARY_CLOUD_API_SECRET!,
  },

  APITOOLKIT: {
    API_KEY: process.env.APITOOLKIT_API_KEY,
  },
  CROSSMINT: {
    API_KEY: process.env.CROSSMINT_API_KEY,
  },
  AGENT: {
    PUBLIC_KEY: process.env.AGENT_PUBLIC_KEY,
    WALLET: process.env.AGENT_WALLET,
  },
  MODE: process.env.MODE,
  ENCRYPTION: {
    KEY: process.env.ENCRYPTION_KEY,
  },
  HELIUS: {
    RPC_URL:
      process.env.MODE === 'dev'
        ? `https://devnet.helius-rpc.com/?api-key=${process.env.HELIUS_RPC_URL}`
        : `http://basic.rpc.solanavibestation.com/?api_key=${process.env.PAID_RPC}`,
  },
  FEE_PAYER: process.env.FEE_PAYER,
};
