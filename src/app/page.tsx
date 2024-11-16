'use client';

import { useState } from 'react';

import Mint from '@/components/mint';
import GenerateNFT from '@/components/mint/GenerateNFT';

export default function HomePage() {
  const [showMint, setShowMint] = useState(false);

  return (
    <>
        <GenerateNFT />
        
        {/* <div className='md:flex hidden w-full'>{showMint && <Mint />}</div> */}
        {showMint && (
          <div
            className='md:hidden fixed inset-0 bg-white/5 backdrop-blur-sm z-50 flex items-center justify-center p-5'
            onClick={() => setShowMint(false)}
          >
            <div
              className='relative w-full max-w-lg flex items-center justify-center'
              onClick={(e) => e.stopPropagation()}
            >
              <Mint />
            </div>
          </div>
        )}
    </>
  );
}
