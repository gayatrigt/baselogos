'use client';

import { useEffect, useRef, useState } from 'react';

import Baselogo from '../../../public/svg/base-logo.svg';

export default function Mint() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showTopBlur, setShowTopBlur] = useState(false);
  const [showBottomBlur, setShowBottomBlur] = useState(false);

  const handleScroll = () => {
    const element = scrollRef.current;
    if (element) {
      setShowTopBlur(element.scrollTop > 10);

      const hasMoreContent = element.scrollHeight > element.clientHeight;
      const isAtBottom =
        Math.abs(
          element.scrollHeight - element.clientHeight - element.scrollTop,
        ) < 10;
      setShowBottomBlur(hasMoreContent && !isAtBottom);
    }
  };

  useEffect(() => {
    const element = scrollRef.current;
    if (element) {
      const hasMoreContent = element.scrollHeight > element.clientHeight;
      setShowBottomBlur(hasMoreContent);
    }
  }, []);

  return (
    <div className='rounded-lg bg-black/20 shadow-inner backdrop-blur-2xl md:p-5 p-3 flex flex-col lg:h-[65vh] h-[55vh] lg:w-full w-fit'>
      <div className='relative flex-1 min-h-0'>
        {showTopBlur && (
          <div className='absolute top-0 left-0 right-1 h-12 bg-gradient-to-b from-black/20 via-black/5 to-transparent z-10 pointer-events-none' />
        )}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className='grid lg:grid-cols-4 grid-cols-3 md:gap-x-5 gap-x-3 gap-y-1 overflow-y-auto pr-2 h-full hover-scroll content-start'
        >
          <Baselogo
            width={131}
            height={131}
            className='rounded transition-transform duration-300 hover:scale-105 cursor-pointer lg:w-[130px] lg:h-[130px] w-[90px] h-[90px]'
          />
          <Baselogo
            width={131}
            height={131}
            className='rounded transition-transform duration-300 hover:scale-105 cursor-pointer lg:w-[130px] lg:h-[130px] w-[90px] h-[90px]'
          />
          <Baselogo
            width={131}
            height={131}
            className='rounded transition-transform duration-300 hover:scale-105 cursor-pointer lg:w-[130px] lg:h-[130px] w-[90px] h-[90px]'
          />
          <Baselogo
            width={131}
            height={131}
            className='rounded transition-transform duration-300 hover:scale-105 cursor-pointer lg:w-[130px] lg:h-[130px] w-[90px] h-[90px]'
          />
          <Baselogo
            width={131}
            height={131}
            className='rounded transition-transform duration-300 hover:scale-105 cursor-pointer lg:w-[130px] lg:h-[130px] w-[90px] h-[90px]'
          />
          <Baselogo
            width={131}
            height={131}
            className='rounded transition-transform duration-300 hover:scale-105 cursor-pointer lg:w-[130px] lg:h-[130px] w-[90px] h-[90px]'
          />
          <Baselogo
            width={131}
            height={131}
            className='rounded transition-transform duration-300 hover:scale-105 cursor-pointer lg:w-[130px] lg:h-[130px] w-[90px] h-[90px]'
          />
          <Baselogo
            width={131}
            height={131}
            className='rounded transition-transform duration-300 hover:scale-105 cursor-pointer lg:w-[130px] lg:h-[130px] w-[90px] h-[90px]'
          />
          <Baselogo
            width={131}
            height={131}
            className='rounded transition-transform duration-300 hover:scale-105 cursor-pointer lg:w-[130px] lg:h-[130px] w-[90px] h-[90px]'
          />
          <Baselogo
            width={131}
            height={131}
            className='rounded transition-transform duration-300 hover:scale-105 cursor-pointer lg:w-[130px] lg:h-[130px] w-[90px] h-[90px]'
          />
          <Baselogo
            width={131}
            height={131}
            className='rounded transition-transform duration-300 hover:scale-105 cursor-pointer lg:w-[130px] lg:h-[130px] w-[90px] h-[90px]'
          />
          <Baselogo
            width={131}
            height={131}
            className='rounded transition-transform duration-300 hover:scale-105 cursor-pointer lg:w-[130px] lg:h-[130px] w-[90px] h-[90px]'
          />
        </div>
        {showBottomBlur && (
          <div className='absolute bottom-0 left-0 right-1 h-12 bg-gradient-to-t from-black/20 via-black/5 to-transparent z-10 pointer-events-none' />
        )}
      </div>
      <button className='rounded py-3 px-4 bg-white/75 backdrop-blur-2xl text-black/90 text-base font-medium w-full hover:bg-white/85 transition-colors mt-5'>
        Mint All
      </button>
    </div>
  );
}
