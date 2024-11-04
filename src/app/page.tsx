'use client';

import { useState } from 'react';

import GenerateNFT from '@/components/mint/GenerateNFT';

export default function HomePage() {
  // const [showMint, setShowMint] = useState(false);
  const [count, setCount] = useState(1);

  const handleGenerate = (value: number) => {
    setCount(value);
    // setShowMint(true);
  };

  return (
    <main className='mx-auto flex flex-col w-screen items-center justify-center px-5'>
      <h1 className='md:mt-7 mt-5 text-black md:text-6xl text-2xl font-semibold'>
        Mint your NFT
      </h1>
      <div className='flex flex-row gap-7 items-stretch justify-center md:mt-7 mt-5'>
        <GenerateNFT onGenerate={handleGenerate} />
        {/* <div className='md:flex hidden w-full'>
          {showMint && <Mint count={count} />}
        </div> */}
        {/* {showMint && (
          <div
            className='md:hidden fixed inset-0 bg-white/5 backdrop-blur-sm z-50 flex items-center justify-center p-5'
            onClick={() => setShowMint(false)}
          >
            <div
              className='relative w-full max-w-lg flex items-center justify-center'
              onClick={(e) => e.stopPropagation()}
            >
              <Mint count={count} />
            </div>
          </div>
        )} */}
      </div>
    </main>
  );
}
