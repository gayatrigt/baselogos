'use server';

import { Address } from 'viem';

import { getTokenIdsFromTransaction } from '@/lib/getTokenIdsFromTransaction';

import ShareNft from '@/components/share/ShareNft';


export interface BaseLogoToken {
  name: string,
  description: string,
  attributes: [ { trait_type: 'Color Name', value: string } ],
  image: string
}

const CongratsPage = async ({searchParams}: {searchParams: {hash: string}}) =>{
  if(!searchParams.hash){
    return <div className='mx-auto flex flex-col w-screen items-center justify-center px-5'>
      <span>Invalid Hash</span>
    </div>
  }

  const {ids, tokens} = await getTokenIdsFromTransaction(searchParams.hash as Address)
 
  const getGridCols = (length: number) => {
    switch(length) {
      case 1: return '';
      case 2: return 'grid-cols-2';
      case 3: return 'grid-cols-3';
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    }
  }

  return (
    <div className='mx-auto flex flex-col w-screen items-center justify-center px-5 py-12'>
      <div className={`grid ${getGridCols(ids.length)} gap-4 place-items-center`}>
        {ids.map((id, idx) => (
          <ShareNft key={id} token={tokens[idx]} tokenId={id} />
        ))}
      </div>
    </div>
  );
}

export default CongratsPage;