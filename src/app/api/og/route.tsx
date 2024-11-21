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

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            justifyContent: "center",
            alignItems: 'center',
            gap: '20px',
            padding: '20px',
          }}
        >
          <div
            style={{
              width: dimensions.width,
              height: dimensions.height,
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundImage: `url(${data.image})`,
            }}
          >
            <img
              src="https://baselogos.com/base-overlay-optimised.png"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </div>
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