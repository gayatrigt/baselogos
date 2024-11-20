'use client';


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
    window.open(
      `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(url)}`,
      '_blank',
    );
  };

  const handleTwitterShare = () => {
    const text = `Check out my Base Logo NFT: ${props.token.name}\n`;
    const url = `${window.location.origin}/share/${props.tokenId}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank',
    );
  };

  const handleOpenSeaView = () => {
    // Replace with your actual OpenSea collection URL
    const openSeaUrl = `https://opensea.io/assets/base/${process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS}/${props.tokenId}`;
    window.open(openSeaUrl, '_blank');
  };

  const handleDownload = async () => {
    try {
      // Fetch the SVG data
      const response = await fetch(props.token.image);
      let svgText = await response.text();

      // change the height and width of the svg to 600 from 100
      svgText = svgText.replaceAll('height="100"', 'height="600"');
      svgText = svgText.replaceAll('width="100"', 'width="600"');
      svgText = svgText.replace('0 0 100 100', '0 0 600 600');

        
      // Parse SVG
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
      const svgElement = svgDoc.documentElement;
      
      // Get SVG dimensions
      const viewBox = svgElement.getAttribute('viewBox')?.split(' ').map(Number);
      const width = svgElement.getAttribute('width') || viewBox?.[2] || 300;
      const height = svgElement.getAttribute('height') || viewBox?.[3] || 150;
      
      // Optional: Modify SVG here if needed
      // Example: svgElement.setAttribute('width', '500');
      
      // Convert SVG back to string
      const serializer = new XMLSerializer();
      const modifiedSvgText = serializer.serializeToString(svgElement);
      
      // Create SVG blob
      const svgBlob = new Blob([modifiedSvgText], { type: 'image/svg+xml' });
      const svgUrl = URL.createObjectURL(svgBlob);

      // Create a new Image object
      const img = new Image();
      img.width = Number(width);
      img.height = Number(height);
      img.src = svgUrl;

      // Wait for image to load
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = (e) => reject(new Error(e.toString()));
      });

      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set canvas size
      canvas.width = img.width;
      canvas.height = img.height;

      // Optional: Set background color if needed
      // ctx.fillStyle = 'white';
      // ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw image to canvas
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Convert canvas to PNG blob
      canvas.toBlob((pngBlob) => {
        if(!pngBlob) return;
        // Create download link
        const pngUrl = URL.createObjectURL(pngBlob);
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = `${props.token.name}.png`;
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        document.body.removeChild(link);
        URL.revokeObjectURL(pngUrl);
        URL.revokeObjectURL(svgUrl);
      }, 'image/png');
    } catch (error) {
      console.error('Error converting and downloading image:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  return (
    <div className='rounded-lg bg-black/20 shadow-inner backdrop-blur-2xl md:p-5 p-3 max-w-lg w-full h-fit'>
      <img
        src={props.token.image}
        className='aspect-square w-full h-full rounded-md'
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
          aria-label='Share on Warpcast'
        >
          <WarpcastIcon className='w-[22px] h-[22px]' />
        </button>
        <button
          onClick={handleTwitterShare}
          className='rounded md:py-3 md:px-4 py-2 px-2.5 bg-white/75 backdrop-blur-2xl text-black/90 text-base font-medium w-full flex items-center justify-center hover:bg-white/85 transition-colors'
          aria-label='Share on Twitter'
        >
          <XIcon className='w-[22px] h-[22px]' />
        </button>
        <button
          onClick={handleOpenSeaView}
          className='rounded md:py-3 md:px-4 py-2 px-2.5 bg-white/75 backdrop-blur-2xl text-black/90 text-base font-medium w-full flex items-center justify-center hover:bg-white/85 transition-colors'
          aria-label='View on OpenSea'
        >
          <OpenSeaIcon className='w-[22px] h-[22px]' />
        </button>
        <button
          onClick={handleDownload}
          className='rounded md:py-3 md:px-4 py-2 px-2.5 bg-white/75 backdrop-blur-2xl text-black/90 text-base font-medium w-full flex items-center justify-center hover:bg-white/85 transition-colors'
          aria-label='Download image'
        >
          <DownloadIcon className='w-[22px] h-[22px]' />
        </button>
      </div>
    </div>
  );
}
