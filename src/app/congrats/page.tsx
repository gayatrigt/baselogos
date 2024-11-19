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

  return (
    <div className='mx-auto flex flex-col w-screen items-center justify-center px-5 py-12'>
      <div className="grid grid-cols-4 gap-4 justify-center">
        {
          ids.map((id, idx) => {
            return <ShareNft key={id} token={tokens[idx]} tokenId={id} />
          })
        }
      </div>
    </div>
  );
}

export default CongratsPage;