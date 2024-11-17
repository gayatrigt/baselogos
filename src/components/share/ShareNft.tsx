"use client";

import { BaseLogoToken } from '@/app/share/[nftId]/page';
import DownloadIcon from '../../../public/svg/download.svg';
import OpenSeaIcon from '../../../public/svg/open-sea.svg';
import WarpcastIcon from '../../../public/svg/warpcast.svg';
import XIcon from '../../../public/svg/x.svg';

interface ShareNftProps {
  token: BaseLogoToken;
  tokenId: string;
}

export default function ShareNft(props: ShareNftProps) {
  const handleWarpcastShare = () => {
    const text = `Check out my Base Logo NFT: ${props.token.name}\n`;
    const url = `${window.location.origin}/share/${props.tokenId}`;
    window.open(`https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const handleTwitterShare = () => {
    const text = `Check out my Base Logo NFT: ${props.token.name}\n`;
    const url = `${window.location.origin}/share/${props.tokenId}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const handleOpenSeaView = () => {
    // Replace with your actual OpenSea collection URL
    const openSeaUrl = `https://opensea.io/assets/base/${props.tokenId}`;
    window.open(openSeaUrl, '_blank');
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(props.token.image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${props.token.name}.png`; // or appropriate extension
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  return (
    <div className='md:mt-7 mt-5 rounded-lg bg-black/20 shadow-inner backdrop-blur-2xl md:p-5 p-3'>
      <img
        src={props.token.image}
        className='aspect-square w-full h-full'
        alt={props.token.name}
      />
      <div className='flex justify-between items-center mt-3'>
        <span className='text-white md:text-base text-sm font-medium bg-white/15 px-4 py-1 rounded whitespace-nowrap'>
          {props.token.name}
        </span>
        <span className='text-white/90 md:text-base text-sm font-medium whitespace-nowrap'>
          {props.token.attributes[0].value}
        </span>
      </div>
      <div className='grid grid-cols-4 md:mt-6 mt-5 gap-2.5'>
        <button
          onClick={handleWarpcastShare}
          className='rounded md:py-3 md:px-4 py-2 px-2.5 bg-white/75 backdrop-blur-2xl text-black/90 text-base font-medium w-full flex items-center justify-center hover:bg-white/85 transition-colors'
          aria-label="Share on Warpcast"
        >
          <WarpcastIcon className='w-[22px] h-[22px]' />
        </button>
        <button
          onClick={handleTwitterShare}
          className='rounded md:py-3 md:px-4 py-2 px-2.5 bg-white/75 backdrop-blur-2xl text-black/90 text-base font-medium w-full flex items-center justify-center hover:bg-white/85 transition-colors'
          aria-label="Share on Twitter"
        >
          <XIcon className='w-[22px] h-[22px]' />
        </button>
        <button
          onClick={handleOpenSeaView}
          className='rounded md:py-3 md:px-4 py-2 px-2.5 bg-white/75 backdrop-blur-2xl text-black/90 text-base font-medium w-full flex items-center justify-center hover:bg-white/85 transition-colors'
          aria-label="View on OpenSea"
        >
          <OpenSeaIcon className='w-[22px] h-[22px]' />
        </button>
        <button
          onClick={handleDownload}
          className='rounded md:py-3 md:px-4 py-2 px-2.5 bg-white/75 backdrop-blur-2xl text-black/90 text-base font-medium w-full flex items-center justify-center hover:bg-white/85 transition-colors'
          aria-label="Download image"
        >
          <DownloadIcon className='w-[22px] h-[22px]' />
        </button>
      </div>
    </div>
  );
}