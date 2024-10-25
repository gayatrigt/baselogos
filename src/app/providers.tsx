'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { baseSepolia } from 'viem/chains';
import { WagmiProvider } from 'wagmi';

import '@rainbow-me/rainbowkit/styles.css';
import '@coinbase/onchainkit/styles.css';

import { config } from '@/lib/wagmi';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <WagmiProvider config={config}>
      <OnchainKitProvider
        apiKey={process.env.NEXT_PUBLIC_CDP_API_KEY}
        chain={baseSepolia as any}
      >
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider
            modalSize='wide'
            theme={darkTheme({
              accentColor: '#fff',
              accentColorForeground: '#000',
              borderRadius: 'large',
              fontStack: 'system',
              overlayBlur: 'small',
            })}
          >
            {mounted && children}
          </RainbowKitProvider>
        </QueryClientProvider>
      </OnchainKitProvider>
    </WagmiProvider>
  );
}
