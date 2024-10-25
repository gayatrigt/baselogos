import Baselogo from '../../../public/svg/base-logo.svg';
import DownloadIcon from '../../../public/svg/download.svg';
import OpenSeaIcon from '../../../public/svg/open-sea.svg';
import WarpcastIcon from '../../../public/svg/warpcast.svg';
import XIcon from '../../../public/svg/x.svg';

export default function ShareNft() {
  return (
    <div className='md:mt-7 mt-5 rounded-lg bg-black/20 shadow-inner backdrop-blur-2xl md:p-5 p-3'>
      <Baselogo
        width={470}
        height={430}
        className='md:w-[470px] md:h-[430px] w-full h-full'
      />
      <div className='flex justify-between items-center mt-3'>
        <span className='text-white md:text-base text-sm font-medium bg-white/15 px-4 py-1 rounded whitespace-nowrap'>
          Baselogo #0002
        </span>
        <span className='text-white/90 md:text-base text-sm font-medium whitespace-nowrap'>
          By 0x86ffe..885
        </span>
      </div>
      <div className='grid grid-cols-4 md:mt-6 mt-5 gap-2.5'>
        <button className='rounded md:py-3 md:px-4 py-2 px-2.5 bg-white/75 backdrop-blur-2xl text-black/90 text-base font-medium w-full flex items-center justify-center hover:bg-white/85 transition-colors'>
          <WarpcastIcon className='w-[22px] h-[22px]' />
        </button>
        <button className='rounded md:py-3 md:px-4 py-2 px-2.5 bg-white/75 backdrop-blur-2xl text-black/90 text-base font-medium w-full flex items-center justify-center hover:bg-white/85 transition-colors'>
          <XIcon className='w-[22px] h-[22px]' />
        </button>
        <button className='rounded md:py-3 md:px-4 py-2 px-2.5 bg-white/75 backdrop-blur-2xl text-black/90 text-base font-medium w-full flex items-center justify-center hover:bg-white/85 transition-colors'>
          <OpenSeaIcon className='w-[22px] h-[22px]' />
        </button>
        <button className='rounded md:py-3 md:px-4 py-2 px-2.5 bg-white/75 backdrop-blur-2xl text-black/90 text-base font-medium w-full flex items-center justify-center hover:bg-white/85 transition-colors'>
          <DownloadIcon className='w-[22px] h-[22px]' />
        </button>
      </div>
    </div>
  );
}
