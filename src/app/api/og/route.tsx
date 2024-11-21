import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'

import { nftContractAbi } from '@/lib/nftContractAbi'

import { BaseLogoToken } from '@/app/congrats/page'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

const client = createPublicClient({
  chain: base,
  transport: http(base.rpcUrls.default.http[0])
})

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const tokenid = searchParams.get('token')
    const isFrame = searchParams.get('fc') === 'true'

    if (!tokenid) {
      return new Response('Missing token parameter', { status: 400 })
    }
    
    const tokenUri = await client.readContract({
      address: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as `0x${string}`,
      abi: nftContractAbi,
      functionName: "tokenURI",
      args: [BigInt(tokenid)]
    })

    const data: BaseLogoToken = await fetch(tokenUri).then(a => a.json())
    const dimensions = isFrame ? { width: 800, height: 800 } : { width: 1200, height: 630 }
    const overlay = isFrame ? "base-overlay-optimised" : "overlay-twitter"

    return new ImageResponse(
      (
        <div
          style={{
            width: dimensions.width,
            height: dimensions.height,
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
            src={data.image}
            width={dimensions.width}
            height={dimensions.height}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              objectFit: 'cover',
            }}
          />
          <img
            src={`https://baselogos.com/${overlay}.png`}
            width={dimensions.width}
            height={dimensions.height}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              objectFit: 'contain',
            }}
          />
        </div>
      ),
      {
        ...dimensions,
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
        },
      }
    )
  } catch (e) {
    console.error(e)
    return new Response(`Failed to generate image: ${e instanceof Error ? e.message : 'Unknown error'}`, { status: 500 })
  }
}