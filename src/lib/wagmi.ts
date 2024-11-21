import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, Chain, } from 'wagmi/chains';

export const APP_NAME = 'BaseLogos';

const customBase: Chain = {
  ...base,
  rpcUrls: {
      ...base.rpcUrls,
      default: {
          http: ['https://base-mainnet.g.alchemy.com/v2/bh2cJYDWOuGInPIDaFfmCQgtWHEGUaoE'],
      },
      public: {
          http: ['https://base.llamarpc.com'],
      },
  },
};

export const config = getDefaultConfig({
  appName: APP_NAME,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
  chains: [customBase],
  ssr: true,
});
