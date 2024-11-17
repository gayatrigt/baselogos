'use server';

import ShareNft from '@/components/share/ShareNft';
import { nftContractAbi } from '@/lib/nftContractAbi';
import { Address, createPublicClient, http } from 'viem'
import { base } from 'viem/chains'

const client = createPublicClient({
    chain: base,
    transport: http(base.rpcUrls.default.http[0])
})

export interface BaseLogoToken {
  name: string,
  description: string,
  attributes: [ { trait_type: 'Color Name', value: string } ],
  image: string
}

export default async function ShareNftPage({params}: {params: {nftId: string}}) {

  const tokenUri =await  client.readContract({
      address: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS!,
      abi: nftContractAbi,
      functionName: "tokenURI",
      args: [BigInt(params.nftId)]
  })

  const data: BaseLogoToken = await fetch(tokenUri).then(a => a.json())
  
  return (
    <div className='mx-auto flex flex-col w-screen items-center justify-center px-5'>
      <h1 className='md:mt-7 mt-5 text-black md:text-6xl text-2xl font-semibold'>
        Share your NFT
      </h1>
      <ShareNft token={data} tokenId={params.nftId} />
    </div>
  );
}
