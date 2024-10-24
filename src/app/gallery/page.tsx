import Baselogo from 'public/svg/base-logo.svg';

export default function GalleryPage() {
  return (
    <div className='mx-auto flex flex-col w-screen items-center justify-center'>
      <h1 className='mt-7 text-black text-6xl font-semibold'>Gallery</h1>
      <div className='mt-7 rounded-lg bg-black/20 shadow-inner backdrop-blur-2xl p-5 grid grid-cols-4 gap-x-10 gap-y-3'>
        <div>
          <Baselogo width={180} height={180} className='rounded' />
          <span className='mt-2 text-white text-base font-semibold'>
            New Color #3245
          </span>
        </div>
        <div>
          <Baselogo width={180} height={180} className='rounded' />
          <span className='mt-2 text-white text-base font-semibold'>
            New Color #3245
          </span>
        </div>
        <div>
          <Baselogo width={180} height={180} className='rounded' />
          <span className='mt-2 text-white text-base font-semibold'>
            New Color #3245
          </span>
        </div>
        <div>
          <Baselogo width={180} height={180} className='rounded' />
          <span className='mt-2 text-white text-base font-semibold'>
            New Color #3245
          </span>
        </div>
        <div>
          <Baselogo width={180} height={180} className='rounded' />
          <span className='mt-2 text-white text-base font-semibold'>
            New Color #3245
          </span>
        </div>
      </div>
    </div>
  );
}
