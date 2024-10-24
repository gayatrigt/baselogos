import Baselogo from 'public/svg/base-logo.svg';
import DownloadIcon from 'public/svg/download.svg';
import OpenSeaIcon from 'public/svg/open-sea.svg';
import WarpcastIcon from 'public/svg/warpcast.svg';
import XIcon from 'public/svg/x.svg';

export default function ShareNft() {
  return (
    <div className='mt-7 rounded-lg bg-black/20 shadow-inner backdrop-blur-2xl p-5'>
      <Baselogo width={470} height={430} />
      <div className='flex justify-between items-center mt-3'>
        <span className='text-white text-base font-medium bg-white/15 px-4 py-1 rounded'>
          Baselogo #0002
        </span>
        <span className='text-white/90 text-base font-medium'>
          By 0x86ffe..885
        </span>
      </div>
      <div className='grid grid-cols-4 mt-6 gap-2.5'>
        <button className='rounded py-3 px-4 bg-white/75 backdrop-blur-2xl text-black/90 text-base font-medium w-full flex items-center justify-center'>
          <WarpcastIcon className='w-[22px] h-[22px]' />
        </button>
        <button className='rounded py-3 px-4 bg-white/75 backdrop-blur-2xl text-black/90 text-base font-medium w-full flex items-center justify-center'>
          <XIcon className='w-[22px] h-[22px]' />
        </button>
        <button className='rounded py-3 px-4 bg-white/75 backdrop-blur-2xl text-black/90 text-base font-medium w-full flex items-center justify-center'>
          <OpenSeaIcon className='w-[22px] h-[22px]' />
        </button>
        <button className='rounded py-3 px-4 bg-white/75 backdrop-blur-2xl text-black/90 text-base font-medium w-full flex items-center justify-center'>
          <DownloadIcon className='w-[22px] h-[22px]' />
        </button>
      </div>
    </div>
  );
}
