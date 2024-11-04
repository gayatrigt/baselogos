import { useEffect, useState } from 'react';
import { useReadContract } from 'wagmi';

import BASECOLOR_ABI from '@/abis/BaseColor.json';
import { BASECOLOR_CONTRACT_ADDRESS } from '@/constant/nft-constants';

interface UseRandomColorsProps {
  count: number;
}

export function useGetRandomColors({ count }: UseRandomColorsProps) {
  const [randomColors, setRandomColors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Get total supply (currentTokenId)
  const {
    data: totalSupply,
    isError: isTotalSupplyError,
    isLoading: isTotalSupplyLoading,
  } = useReadContract({
    address: BASECOLOR_CONTRACT_ADDRESS,
    abi: BASECOLOR_ABI,
    functionName: 'currentTokenId',
    chainId: 8453,
  });

  // Get all minted colors
  const {
    data: allColors,
    isError: isColorsError,
    isLoading: isColorsLoading,
  } = useReadContract({
    address: BASECOLOR_CONTRACT_ADDRESS,
    abi: BASECOLOR_ABI,
    functionName: 'getMintedColorsRange',
    args: totalSupply ? [BigInt(0), totalSupply] : undefined,
    chainId: 8453,
  });

  useEffect(() => {
    if (!allColors || !count || count <= 0) return;

    setIsLoading(true);
    setError(null);

    try {
      // Create a copy of the colors array
      const colorsCopy = Array.isArray(allColors) ? [...allColors] : [];
      const selected: string[] = [];

      // Ensure we don't try to select more colors than available
      const selectCount = Math.min(count, colorsCopy.length);

      // Select random colors
      for (let i = 0; i < selectCount; i++) {
        // Generate random index
        const randomIndex = Math.floor(Math.random() * colorsCopy.length);

        // Add selected color to result array
        selected.push(colorsCopy[randomIndex]);

        // Remove selected color from copy array to avoid duplicates
        colorsCopy.splice(randomIndex, 1);
      }

      setRandomColors(selected);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('Failed to select random colors'),
      );
    } finally {
      setIsLoading(false);
    }
  }, [allColors, count]);

  return {
    colors: randomColors,
    isLoading: isLoading || isTotalSupplyLoading || isColorsLoading,
    error:
      error ||
      (isTotalSupplyError || isColorsError
        ? new Error('Failed to fetch colors from contract')
        : null),
    totalSupply: totalSupply ? Number(totalSupply) : undefined,
  };
}
