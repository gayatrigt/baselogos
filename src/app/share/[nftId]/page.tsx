import React from 'react';

import ShareNft from '@/components/share/ShareNft';

export default function ShareNftPage() {
  return (
    <div className='mx-auto flex flex-col w-screen items-center justify-center'>
      <h1 className='mt-7 text-black text-6xl font-semibold'>Share your NFT</h1>
      <ShareNft />
    </div>
  );
}
