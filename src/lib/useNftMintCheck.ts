import { useAccount, useBalance, useReadContract } from 'wagmi'

import { nftContractAbi } from '@/lib/nftContractAbi'

export const useNftMintCheck = () => {
    const { address } = useAccount()

    const { data: mintPrice } = useReadContract({
        address: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as any,
        abi: nftContractAbi,
        functionName: "mintPrice",
    })

    const { data: balance } = useBalance({
        address,
    })

    const hasEnoughBalance = (): boolean => {
        if (!mintPrice || !balance) {
            return false
        }

        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        const ethMintPriceInWei = BigInt(mintPrice.toString())
        const balanceInWei = balance.value

        return balanceInWei >= ethMintPriceInWei
    }

    return {
        mintPrice,
        balance,
        hasEnoughBalance,
    }
}