"use client"

import { Transaction, TransactionButton } from '@coinbase/onchainkit/transaction';
import { useEffect, useState } from 'react';
import { twMerge } from "tailwind-merge";
import { encodeFunctionData, formatEther } from "viem";
import { useAccount } from "wagmi";
import { base } from 'wagmi/chains';

import { nftContractAbi } from '@/lib/nftContractAbi';
import { useNftMintCheck } from '@/lib/useNftMintCheck';

import WalletConnectionButton from '@/components/buttons/WalletConnectionButton';


const nftContractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;


interface MintButtonProps {
    quantity: number
}
export const MintButton: React.FC<MintButtonProps> = ({quantity}) => {
    console.log("🚀 ~ quantity:", quantity)
    const { mintPrice, hasEnoughBalance } = useNftMintCheck()
    const { address } = useAccount()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [tokens, setTokens] = useState<number[]>([])
    console.log("🚀 ~ tokens:", tokens)
    
    const fetchEligibleTokens = async () => {
        try {
            if(loading) return

            setLoading(true)
            setError(null)
            
            const response = await fetch(`/api/eligible-tokens?quantity=${quantity}`)
            const data = await response.json()
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch eligible tokens')
            }
            
            setTokens(data.tokens)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch tokens')
        } finally {
            setLoading(false)
        }
    }

    const getButtonText = () => {
        if (!hasEnoughBalance()) return "Insufficient Balance";
        return `Mint for ${mintPrice && formatEther(mintPrice)} ETH`;
    }

    // const handleOnStatus = async (status: LifecycleStatus) => {
    //     // setSidebarMode("loading");

    //     if (status.statusName !== 'success') {
    //         return
    //     }

    //     const hash = status.statusData.transactionReceipts[0]?.transactionHash

    //     if (!hash) {
    //         return;
    //     }

    //     try {
    //         // const tokenDataRes = await getTokenUriFromHash(hash)
    //         // setMintedNftMetadata(tokenDataRes.tokenData)

    //         // await fetchOwnedArrows(account.address as any);
    //         // setSidebarMode("success");

    //         // router.push(`/canvas?panel=text&tokenid=${tokenDataRes.tokenId}`)
    //         // setSidebarMode("success");
    //         // setTextValue([])
    //     } catch (error) {
    //         console.error(error);

    //         // setSidebarMode("mint");

    //         const showToUser = (error as any).showToUser;
    //         const errorMessage = (error as any).message;
    //         // toast(
    //         //     showToUser ? {
    //         //         variant: "destructive",
    //         //         title: errorMessage,
    //         //     } : {
    //         //         variant: "destructive",
    //         //         title: 'Something went wrong.',
    //         //         description: 'Could not mint NFT, please try again later.'
    //         //     }
    //         // );
    //     }
    // }

    const encodedData = encodeFunctionData({
        abi: nftContractAbi,
        functionName: "batchMint",
        args: [tokens.map(i => BigInt(i))],
    });

    const mintContractCalls: any[] = [
        {
            // base sepolia
            to: nftContractAddress as any,

            // base mainnet
            // to: "0xdFaebb66DFeef3b7EfE3e1C6Be0e1d5448E5Ff7d",

            data: encodedData,
            value: mintPrice as any,
        },
    ];

    useEffect(() => {
        fetchEligibleTokens()
    }, [quantity])

    return <div className="relative w-full">
        <div
            className="w-full flex space-x-2 justify-center items-center "
        >
            {/* {!isValidWord && <Button className='w-full' disabled>Already Minted</Button>} */}
            {!address &&
                <WalletConnectionButton />
            }

            {
                !!address &&

                <Transaction
                    key={quantity}
                    chainId={base.id}
                    calls={mintContractCalls}
                    // onStatus={handleOnStatus}
                >
                    <TransactionButton
                        disabled={!hasEnoughBalance()}
                        className={twMerge(
                            'w-full h-full bg-brand text-white py-3 cursor-pointer font-medium tracking-wider text-xl hover:bg-brand/80 focus:bg-brand/80 flex items-center justify-center space-x-2 rounded-md',
                            "inline-flex items-center justify-center whitespace-nowrap text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-bold uppercase  cursor-pointer [&>*]:text-white ",
                            "bg-blue-600 text-white hover:bg-blue-600/90"
                        )}
                        text={getButtonText()}
                    />
                </Transaction>
            }

        </div>
        {!!address && !hasEnoughBalance() && <div className=" top-full text-xs mt-1 font-semibold text-center w-full">You don&apos;t have enough balance</div>}
    </div>

}
