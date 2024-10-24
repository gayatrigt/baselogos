import Baselogo from 'public/svg/base-logo.svg';
import React from 'react';

export default function GenerateNFT() {
  return (
    <div className='mt-7 rounded-lg bg-black/20 shadow-inner backdrop-blur-2xl p-5'>
      <Baselogo width={470} height={430} />
      <button className='rounded py-3 px-4 bg-white/75 backdrop-blur-2xl text-black/90 text-base font-medium w-full mt-5'>
        Generate Random
      </button>
    </div>
  );
}
