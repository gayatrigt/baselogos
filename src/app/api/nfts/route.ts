import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import {
  BASELOGO_CONTRACT_ADDRESS,
  CHAIN,
  OPENSEA_BASEURL,
} from '@/constant/nft-constants';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const next = searchParams.get('next');

    const baseUrl = `${OPENSEA_BASEURL}/api/v2/chain/${CHAIN}/contract/${BASELOGO_CONTRACT_ADDRESS}/nfts`;
    const url = new URL(baseUrl);
    url.searchParams.append('limit', '20');
    if (next) {
      url.searchParams.append('next', next);
    }

    const response = await fetch(url.toString(), {
      headers: {
        accept: 'application/json',
        'x-api-key': process.env.OPENSEA_API_KEY as string,
      },
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      throw new Error(`OpenSea API returned ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('OpenSea API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch NFTs' },
      { status: 500 },
    );
  }
}
