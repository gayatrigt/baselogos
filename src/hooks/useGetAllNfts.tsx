import { useInfiniteQuery } from '@tanstack/react-query';

export interface NFT {
  identifier: string;
  collection: string;
  contract: string;
  token_standard: string;
  name: string;
  description: string;
  image_url: string;
  display_image_url: string;
  display_animation_url: string | null;
  metadata_url: string;
  opensea_url: string;
  updated_at: string;
  is_disabled: boolean;
  is_nsfw: boolean;
}

interface NFTsResponse {
  nfts: NFT[];
  next: string;
}

export function useGetAllNfts() {
  return useInfiniteQuery<NFTsResponse, Error>({
    queryKey: ['nfts'],

    initialPageParam: '',

    queryFn: async ({ pageParam }) => {
      const url = pageParam ? `/api/nfts?next=${pageParam}` : '/api/nfts';

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch NFTs');
      }

      return response.json();
    },

    getNextPageParam: (lastPage) => lastPage.next || undefined,
  });
}
