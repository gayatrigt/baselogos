/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useRef, useState } from 'react';
import { useAccount } from 'wagmi';

import { NFT, useGetAllNfts } from '@/hooks/useGetAllNfts';
import { useGetOwnedNfts } from '@/hooks/useGetOwnedNfts';

type ViewType = 'recent' | 'owned';

export default function GalleryPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showTopBlur, setShowTopBlur] = useState(false);
  const [showBottomBlur, setShowBottomBlur] = useState(false);
  const [activeView, setActiveView] = useState<ViewType>('recent');

  const { address, isConnected } = useAccount();

  // Queries
  const recentNfts = useGetAllNfts();
  const ownedNfts = useGetOwnedNfts({ address });

  // Get current query based on active view
  const currentQuery = activeView === 'recent' ? recentNfts : ownedNfts;
  const { data, fetchNextPage, hasNextPage, isLoading } = currentQuery;

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

      if (hasNextPage && !isLoading && isAtBottom) {
        fetchNextPage();
      }
    }
  };

  useEffect(() => {
    const element = scrollRef.current;
    if (element) {
      const hasMoreContent = element.scrollHeight > element.clientHeight;
      setShowBottomBlur(hasMoreContent);
    }
  }, [data?.pages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [activeView]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className='mx-auto flex flex-col w-screen items-center justify-center px-5'>
      <div className='flex items-center justify-between md:mt-7 mt-5 flex-col gap-2'>
        <h1 className='text-black md:text-6xl text-2xl font-semibold'>
          Gallery
        </h1>
        <div className='space-x-4'>
          <button
            onClick={() => setActiveView('recent')}
            className={`cursor-pointer hover:opacity-75 ${
              activeView === 'recent'
                ? 'text-blue-500 font-semibold'
                : 'text-gray-500'
            }`}
          >
            Recent
          </button>
          <button
            onClick={() => setActiveView('owned')}
            disabled={!isConnected}
            className={`cursor-pointer hover:opacity-75 ${
              !isConnected
                ? 'text-gray-400 cursor-not-allowed'
                : activeView === 'owned'
                  ? 'text-blue-500 font-semibold'
                  : 'text-gray-500'
            }`}
          >
            Owned
          </button>
        </div>
      </div>

      {activeView === 'owned' && !isConnected ? (
        <div className='mt-10 text-center text-gray-500'>
          Please connect your wallet to view owned NFTs
        </div>
      ) : (
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
              {data?.pages.map((page) =>
                page.nfts.map((nft: NFT) => (
                  <div
                    key={nft.identifier}
                    className='flex flex-col items-start transition-transform duration-300 hover:scale-105 cursor-pointer'
                  >
                    <img
                      src={nft.display_image_url}
                      alt={nft.name}
                      className='rounded md:w-[180px] md:h-[180px] w-[90px] h-[90px]'
                    />
                    <span className='md:mt-2 mt-1 text-white md:text-base text-[10px] md:font-semibold whitespace-nowrap'>
                      New Color #{nft.identifier.toString().padStart(4, '0')}
                    </span>
                  </div>
                )),
              )}
              {isLoading && (
                <div className='col-span-full flex justify-center py-4'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white'></div>
                </div>
              )}
            </div>
            {showBottomBlur && (
              <div className='absolute bottom-0 left-0 right-2 h-12 bg-gradient-to-t from-black/20 via-black/5 to-transparent z-10 pointer-events-none' />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
