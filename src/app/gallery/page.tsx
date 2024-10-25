'use client';

import Baselogo from 'public/svg/base-logo.svg';
import { useEffect, useRef, useState } from 'react';

export default function GalleryPage() {
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
    <div className='mx-auto flex flex-col w-screen items-center justify-center px-5'>
      <h1 className='md:mt-7 mt-5 text-black md:text-6xl text-2xl font-semibold'>
        Gallery
      </h1>
      <div className='md:mt-7 mt-5 rounded-lg bg-black/20 shadow-inner backdrop-blur-2xl md:p-5 p-3 w-full max-w-max flex flex-col h-[70vh]'>
        <div className='relative flex-1 min-h-0'>
          {showTopBlur && (
            <div className='absolute top-0 left-0 right-2 h-12 bg-gradient-to-b from-black/20 via-black/5 to-transparent z-10 pointer-events-none' />
          )}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className='grid sm:grid-cols-4 grid-cols-3 md:gap-x-10 gap-x-4 gap-y-3 overflow-y-auto pr-2 h-full hover-scroll content-start'
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className='flex flex-col items-start transition-transform duration-300 hover:scale-105 cursor-pointer'
              >
                <Baselogo className='rounded md:w-[180px] md:h-[180px] w-[90px] h-[90px]' />
                <span className='md:mt-2 mt-1 text-white md:text-base text-[10px] md:font-semibold whitespace-nowrap'>
                  New Color #{(3245 + i).toString().padStart(4, '0')}
                </span>
              </div>
            ))}
          </div>
          {showBottomBlur && (
            <div className='absolute bottom-0 left-0 right-2 h-12 bg-gradient-to-t from-black/20 via-black/5 to-transparent z-10 pointer-events-none' />
          )}
        </div>
        <style>
          {`
            .hover-scroll {
              scrollbar-width: none;
              -ms-overflow-style: none;
            }

            .hover-scroll::-webkit-scrollbar {
              display: none;
            }

            .hover-scroll:hover {
              scrollbar-width: thin;
              -ms-overflow-style: auto;
            }

            .hover-scroll:hover::-webkit-scrollbar {
              width: 6px;
              background-color: transparent;
            }
            
            .hover-scroll:hover::-webkit-scrollbar-track {
              background: rgba(255, 255, 255, 0.1);
              border-radius: 3px;
              margin: 4px 0;
            }
            
            .hover-scroll:hover::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.2);
              border-radius: 3px;
              border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .hover-scroll:hover::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 255, 255, 0.3);
            }

            .hover-scroll {
              scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1);
            }
          `}
        </style>
      </div>
    </div>
  );
}
