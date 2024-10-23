import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base } from 'wagmi/chains';

export const APP_NAME = 'BaseLogos';

export const config = getDefaultConfig({
  appName: APP_NAME,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
  chains: [base],
  ssr: false,
});
