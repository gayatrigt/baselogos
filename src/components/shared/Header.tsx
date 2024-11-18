import Link from 'next/link';

import WalletConnectionButton from '@/components/buttons/WalletConnectionButton';

export default function Header() {
  return (
    <div className='border-b border-black/30 flex justify-between md:px-20 md:py-5 px-5 py-2.5 items-center'>
      <div className='flex items-center md:gap-6 gap-3'>
        <Link href='/' className='text-black/90 md:text-2xl text-sm font-bold'>
          Base Logos
        </Link>
      </div>
      <div className='flex items-center md:gap-6 gap-3'>
        <Link href='/gallery' className='text-black md:text-lg text-sm'>
          Gallery
        </Link>
        <WalletConnectionButton />
      </div>
    </div>
  );
}
