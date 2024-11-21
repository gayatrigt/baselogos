'use server';

import { Metadata } from 'next';
import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'

import { nftContractAbi } from '@/lib/nftContractAbi';

import ShareNft from '@/components/share/ShareNft';

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

export async function generateMetadata({ params }: { params: { nftId: string } }): Promise<Metadata> {
  const tokenUri = await client.readContract({
    address: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as `0x${string}`,
    abi: nftContractAbi,
    functionName: "tokenURI",
    args: [BigInt(params.nftId)]
  })

  const data: BaseLogoToken = await fetch(tokenUri).then(a => a.json())
  const baseUrl = 'https://www.baselogos.com'

  // Regular OG image URL
  const ogUrl = `${baseUrl}/api/og?token=${params.nftId}`
  // Frame-specific URL with fc=true
  const frameUrl = `${baseUrl}/api/og/token=${params.nftId}&fc=true`

  return {
    title: `${data.name} - Base Logo NFT`,
    description: data.description,
    openGraph: {
      title: `${data.name} - Base Logo NFT`,
      description: data.description,
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: data.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${data.name} - Base Logo NFT`,
      description: data.description,
      images: [ogUrl],
    },
    other: {
      'fc:frame': 'vNext',
      'fc:frame:image': frameUrl,
      'fc:frame:image:aspect_ratio': '1:1',
      'fc:frame:button:1': 'Check this out',
      'fc:frame:button:1:action': 'link',
      'fc:frame:button:1:target': `https://www.baselogos.com/share/${params.nftId}`,
      'fc:frame:button:2': 'Mint Base Logos',
      'fc:frame:button:2:action': 'post',
      'fc:frame:button:2:target': 'https://baselogos-frame.vercel.app/frames',
    }
  }
}

export default async function ShareNftPage({params}: {params: {nftId: string}}) {

  const tokenUri =await  client.readContract({
      address: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as any,
      abi: nftContractAbi,
      functionName: "tokenURI",
      args: [BigInt(params.nftId)]
  })

  const data: BaseLogoToken = await fetch(tokenUri).then(a => a.json())
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'
  const ogUrl = `${baseUrl}/api/og?token=${params.nftId}`
  const frameUrl = `${baseUrl}/api/og?token=${params.nftId}&fc=true`
  
  return (
    <>
       {/* <Head>
        <title>{`${data.name} - Base Logo NFT`}</title>
        <meta name="description" content={data.description} />
        
        <meta property="og:title" content={`${data.name} - Base Logo NFT`} />
        <meta property="og:description" content={data.description} />
        <meta property="og:image" content={ogUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${data.name} - Base Logo NFT`} />
        <meta name="twitter:description" content={data.description} />
        <meta name="twitter:image" content={ogUrl} />
        
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={frameUrl} />
        <meta property="fc:frame:image:aspect_ratio" content="1:1" />
        <meta property="fc:frame:button:1" content="Check this out" />
        <meta property="fc:frame:button:1:action" content="link" />
        <meta property="fc:frame:button:1:target" content={`https://www.baselogos.com/share/${params.nftId}`} />
        <meta property="fc:frame:button:2" content="Mint Base Logos" />
        <meta property="fc:frame:button:2:action" content="post" />
        <meta property="fc:frame:button:2:target" content="https://baselogos-frame.vercel.app/frames" />
      </Head> */}

      <div className='mx-auto flex flex-col w-screen items-center justify-center px-5'>
      {/* <h1 className='md:mt-7 mt-5 text-black md:text-6xl text-2xl font-semibold'>
        Share your NFT
      </h1> */}
      <ShareNft token={data} tokenId={params.nftId} />
    </div>
    
    </>

  );
}
