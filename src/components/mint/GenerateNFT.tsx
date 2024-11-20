'use client';

import { ChangeEvent, useState } from 'react';

// import BaseLogo from '../../../public/svg/base-logo.svg';
import BaseLogoPreview from '@/components/BaseLogoPreview';
import { MintButton } from '@/components/MintButton';

import MinusIcon from '../../../public/svg/minus.svg';
import PlusIcon from '../../../public/svg/plus.svg';

const GenerateNFT = () => {
  const [value, setValue] = useState(1);

  const handleIncrement = () => {
    setValue((prev) => Math.min(prev + 1, 20));
  };

  const handleDecrement = () => {
    setValue((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if(!e.target.value?.length) {
      setValue(0);
    }

    const newValue = parseInt(e.target.value);
    if (!isNaN(newValue) && newValue >= 1) {
      setValue(Math.min(newValue, 20));
    }
  };

  return (
    <div className='rounded-lg bg-black/20 shadow-inner backdrop-blur-2xl p-3 md:p-5 w-full max-w-xl'>
      <div className='flex flex-col h-full'>

        <BaseLogoPreview className='h-full lg:inset-0 lg:object-contain w-full mb-5' />
       
        <div className='flex space-x-4'>
      
          <div className='flex items-stretch space-x-2 flex-1 h-full'>
            <button
              onClick={handleDecrement}
              className='hover:bg-white/10 rounded-lg transition-colors h-11 w-11 aspect-square inline-flex items-center justify-center'
            >
              <MinusIcon className='w-4 h-4 sm:w-5 sm:h-5' />
            </button>
            <input
              className='rounded px-2.5 border-none bg-white/75 backdrop-blur-2xl text-black/90 text-xs sm:text-base font-medium w-16 sm:w-20 text-center focus:ring-2 focus:ring-white/25 focus:outline-none flex-1'
              min={1}
              max={20}
              type='number'
              value={value}
              onChange={handleChange}
            />
            <button
              onClick={handleIncrement}
              className='hover:bg-white/10 rounded-lg transition-colors h-11 w-11 aspect-square inline-flex items-center justify-center'
            >
              <PlusIcon className='w-4 h-4 sm:w-5 sm:h-5' />
            </button>
          </div>

          <div className='flex-1 w-full'>
            <MintButton quantity={value} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateNFT;
