'use client';

import { ChangeEvent, useState } from 'react';

import BaseLogo from '../../../public/svg/base-logo.svg';
import MinusIcon from '../../../public/svg/minus.svg';
import PlusIcon from '../../../public/svg/plus.svg';

interface GenerateNFTProps {
  onGenerate: (value: number) => void;
}

const GenerateNFT = ({ onGenerate }: GenerateNFTProps) => {
  const [value, setValue] = useState(1);

  const handleIncrement = () => {
    setValue((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setValue((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newValue = parseInt(e.target.value);
    if (!isNaN(newValue) && newValue >= 1) {
      setValue(newValue);
    }
  };

  return (
    <div className='rounded-lg bg-black/20 shadow-inner backdrop-blur-2xl p-3 md:p-5 lg:h-[65vh] lg:max-w-max w-full'>
      <div className='flex flex-col h-full'>
        <div className='lg:flex-1 lg:min-h-0 lg:relative lg:w-[470px] mb-5'>
          <BaseLogo className='h-full lg:w-[470px] lg:absolute lg:inset-0 lg:object-contain w-full' />
        </div>
        <div className='flex sm:gap-5 gap-3 mt-auto'>
          <button
            onClick={() => onGenerate(value)}
            className='rounded sm:py-3 sm:px-4 py-2 px-2.5 bg-white/75 backdrop-blur-2xl text-black/90 sm:text-base text-xs font-medium w-full hover:bg-white/85 transition-colors whitespace-nowrap'
          >
            Generate Random
          </button>
          <div className='flex items-center gap-2 justify-start'>
            <button
              onClick={handleDecrement}
              className='p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-colors'
            >
              <MinusIcon className='w-4 h-4 sm:w-5 sm:h-5' />
            </button>
            <input
              className='rounded sm:py-3 sm:px-4 py-2 px-2.5  border-none bg-white/75 backdrop-blur-2xl text-black/90 text-xs sm:text-base font-medium w-16 sm:w-20 text-center focus:ring-2 focus:ring-white/25 focus:outline-none'
              min={1}
              type='number'
              value={value}
              onChange={handleChange}
            />
            <button
              onClick={handleIncrement}
              className='p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-colors'
            >
              <PlusIcon className='w-4 h-4 sm:w-5 sm:h-5' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateNFT;
