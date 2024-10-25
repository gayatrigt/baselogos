import React from 'react';

import ShareNft from '@/components/share/ShareNft';

export default function ShareNftPage() {
  return (
    <div className='mx-auto flex flex-col w-screen items-center justify-center px-5'>
      <h1 className='md:mt-7 mt-5 text-black md:text-6xl text-2xl font-semibold'>
        Share your NFT
      </h1>
      <ShareNft />
    </div>
  );
}
