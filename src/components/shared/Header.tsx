export default function Header() {
  return (
    <div className='border-b border-black/30 flex justify-between px-20 py-5 items-center'>
      <span className='text-black/90 text-2xl font-bold'>BaseLogos</span>
      <button className='text-white text-sm font-medium py-3 px-4 bg-black rounded'>
        Connect Wallet
      </button>
    </div>
  );
}
