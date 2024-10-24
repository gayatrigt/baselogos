import Baselogo from 'public/svg/base-logo.svg';

export default function Mint() {
  return (
    <div className='mt-7 rounded-lg bg-black/20 shadow-inner backdrop-blur-2xl p-5 '>
      <div className='grid grid-cols-4 gap-x-5 gap-y-1'>
        <Baselogo width={131} height={131} className='rounded' />
        <Baselogo width={131} height={131} className='rounded' />
        <Baselogo width={131} height={131} className='rounded' />
        <Baselogo width={131} height={131} className='rounded' />
        <Baselogo width={131} height={131} className='rounded' />
      </div>
      <button className='rounded py-3 px-4 bg-white/75 backdrop-blur-2xl text-black/90 text-base font-medium w-full mt-5 '>
        Mint All
      </button>
    </div>
  );
}
