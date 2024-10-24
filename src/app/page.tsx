import Mint from '@/components/mint';
import GenerateNFT from '@/components/mint/GenerateNFT';

export default function HomePage() {
  return (
    <main className='mx-auto flex flex-col w-screen items-center justify-center'>
      <h1 className='mt-7 text-black text-6xl font-semibold'>Mint your NFT</h1>
      <div className='flex gap-7 items-start justify-center'>
        <GenerateNFT />
        <Mint />
      </div>
    </main>
  );
}
