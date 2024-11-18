import { useInfiniteQuery } from '@tanstack/react-query';

import { NFT } from '@/hooks/useGetAllNfts';

interface NFTsResponse {
  nfts: NFT[];
  next: string;
}

interface UseGetOwnedNftsParams {
  address?: string | undefined;
}

export function useGetOwnedNfts(params: UseGetOwnedNftsParams) {
  const { address } = params;

  return useInfiniteQuery<NFTsResponse, Error>({
    queryKey: ['nfts', address],

    initialPageParam: '',

    queryFn: async ({ pageParam }) => {
      const url = new URL('/api/owned-nfts', window.location.origin);

      if (address) {
        url.searchParams.append('address', address);
      }

      if (pageParam) {
        url.searchParams.append('next', pageParam as string);
      }

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error('Failed to fetch NFTs');
      }

      return response.json();
    },

    getNextPageParam: (lastPage) => lastPage.next || undefined,

    enabled: !!address,
  });
}
