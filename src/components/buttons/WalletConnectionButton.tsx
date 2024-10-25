'use client';

import {
  Address,
  Avatar,
  EthBalance,
  Identity,
  Name,
} from '@coinbase/onchainkit/identity';
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownBasename,
  WalletDropdownDisconnect,
  WalletDropdownLink,
} from '@coinbase/onchainkit/wallet';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useConnect } from 'wagmi';

export default function WalletConnectionButton() {
  const { address } = useAccount();
  const { connect, connectors } = useConnect();
  const { openConnectModal } = useConnectModal();

  function connectToSmartWallet() {
    const coinbaseWalletConnector = connectors.find(
      (connector) => connector.id === 'coinbaseWalletSDK',
    );

    if (coinbaseWalletConnector) {
      connect({ connector: coinbaseWalletConnector });
    }
  }

  function connectToExistingWallet() {
    openConnectModal && openConnectModal();
  }

  return (
    <div>
      {address && (
        <Wallet>
          <ConnectWallet
            withWalletAggregator={true}
            className='font-bold flex items-center bg-black hover:bg-black/80'
          >
            <Name className='text-white text-base font-sans' />
          </ConnectWallet>
          <WalletDropdown className='z-50 rounded-lg bg-black/20 shadow-inner backdrop-blur-2xl hover:bg-black/20'>
            <Identity
              className='px-4 pt-3 pb-2 bg-transparent hover:bg-black/60'
              hasCopyAddressOnClick={true}
            >
              <Avatar />
              <Name />
              <Address />
              <EthBalance className='text-white' />
            </Identity>
            <WalletDropdownBasename className='bg-transparent hover:bg-black/60' />
            <WalletDropdownLink
              className='bg-transparent hover:bg-black/60'
              icon='wallet'
              href='https://wallet.coinbase.com'
            >
              Go to Wallet Dashboard
            </WalletDropdownLink>
            <WalletDropdownDisconnect className='bg-transparent hover:bg-black/60' />
          </WalletDropdown>
        </Wallet>
      )}

      {!address && (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className='text-white md:text-sm text-xs font-medium py-3 px-4 bg-black rounded hover:bg-black/80'>
              Connect Wallet
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className='min-w-[220px] z-50 rounded-lg bg-black/20 shadow-inner backdrop-blur-2xl hover:bg-black/20'
              sideOffset={5}
              align='end'
              alignOffset={0}
            >
              <DropdownMenu.Item
                className='text-white font-medium px-4 py-3 rounded outline-none cursor-pointer hover:bg-black/60 transition-colors'
                onSelect={connectToExistingWallet}
              >
                I Have a Wallet
              </DropdownMenu.Item>

              <DropdownMenu.Item
                className='text-white font-medium px-4 py-3 rounded outline-none cursor-pointer hover:bg-black/60 transition-colors'
                onSelect={connectToSmartWallet}
              >
                Create a Smart Wallet
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      )}
    </div>
  );
}
