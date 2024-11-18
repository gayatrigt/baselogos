"use client"

import { LifecycleStatus, Transaction, TransactionButton } from '@coinbase/onchainkit/transaction';
import { useEffect, useState } from 'react';
import { twMerge } from "tailwind-merge";
import { decodeEventLog, encodeFunctionData, formatEther } from "viem";
import { useAccount, usePublicClient } from "wagmi";
import { base } from 'wagmi/chains';
import { useSearchParams } from 'next/navigation';

import { nftContractAbi } from '@/lib/nftContractAbi';
import { useNftMintCheck } from '@/lib/useNftMintCheck';

import WalletConnectionButton from '@/components/buttons/WalletConnectionButton';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const nftContractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;

interface MintButtonProps {
    quantity: number
}

export const MintButton: React.FC<MintButtonProps> = ({quantity}) => {
    const { mintPrice, hasEnoughBalance } = useNftMintCheck()
    const router = useRouter()
    const searchParams = useSearchParams()

    const { address } = useAccount()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [tokens, setTokens] = useState<number[]>([])

    const publicClient = usePublicClient()
    
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

    const getSelectedTokensFromParams = () => {
        const selectedTokens = searchParams.get('selectedTokens')
        if (!selectedTokens) return null

        try {
            // Parse the comma-separated string of token IDs
            const tokenArray = selectedTokens.split(',').map(token => parseInt(token.trim()))
            
            // Validate that we have the correct quantity and all values are valid numbers
            if (tokenArray.length !== quantity || tokenArray.some(isNaN)) {
                return null
            }

            return tokenArray
        } catch (err) {
            console.error('Error parsing selected tokens:', err)
            return null
        }
    }

    const getButtonText = () => {
        if (!hasEnoughBalance()) return "Insufficient Balance";
        return `Mint for ${mintPrice && formatEther(mintPrice * BigInt(quantity))} ETH`;
    }

    const getTokenUriFromHash = async (hash: string) => {
        if(!publicClient) return;

        const receipt = await publicClient.waitForTransactionReceipt({ hash: hash as any });

        if (!receipt) {
            throw new Error('Transaction failed');
        }

        const transferLog = receipt.logs.find((log) => {
            try {
                const event = decodeEventLog({
                    abi: nftContractAbi,
                    data: log.data,
                    topics: log.topics,
                })
                return event.eventName === 'Transfer' && (event.args as any)?.from === '0x0000000000000000000000000000000000000000'
            } catch {
                return false
            }
        })

        if (!transferLog) {
            throw new Error('No mint Transfer event found in the transaction')
        }

        const event = decodeEventLog({
            abi: nftContractAbi,
            data: transferLog.data,
            topics: transferLog.topics,
        })
        const tokenId: number = (event.args as any)?.tokenId

        const tokenURI = await publicClient.readContract({
            address: nftContractAddress as any,
            abi: nftContractAbi,
            functionName: 'tokenURI',
            args: [BigInt(tokenId)],
        })

        if (!tokenURI) {
            throw new Error('Failed to fetch token URI')
        }

        const tokenData = await fetch(tokenURI as string).then(response => response.json())

        return { tokenId, tokenURI, tokenData }
    }

    const handleOnStatus = async (status: LifecycleStatus) => {
        if (status.statusName !== 'success') {
            return
        }

        const hash = status.statusData.transactionReceipts?.[0]?.transactionHash

        if (!hash) {
            return;
        }

        const tokenDataRes = await getTokenUriFromHash(hash)

        if(!tokenDataRes) return;

        router.push(`/share/${tokenDataRes.tokenId}`)

        toast.success('Successfully Minted!!!')
    }

    useEffect(() => {
        const selectedTokens = getSelectedTokensFromParams()
        if (selectedTokens) {
            setTokens(selectedTokens)
        } else {
            fetchEligibleTokens()
        }
    }, [quantity, searchParams])

    const encodedData = encodeFunctionData({
        abi: nftContractAbi,
        functionName: "batchMint",
        args: [tokens.map(token => BigInt(token))],
    });

    const mintContractCalls: any[] = [
        {
            to: nftContractAddress as any,
            data: encodedData,
            value: (mintPrice || BigInt(0)) * BigInt(quantity),
        },
    ];

    return (
        <div className="relative w-full">
            <div className="w-full flex space-x-2 justify-center items-center">
                {!address && <WalletConnectionButton />}
                {!!address && (
                    <Transaction
                        key={JSON.stringify(tokens)}
                        chainId={base.id}
                        calls={mintContractCalls}
                        onStatus={handleOnStatus}
                    >
                        <TransactionButton
                            disabled={!hasEnoughBalance() || loading}
                            className={twMerge(
                                'w-full h-full bg-brand text-white py-3 cursor-pointer font-medium tracking-wider text-xl hover:bg-brand/80 focus:bg-brand/80 flex items-center justify-center space-x-2 rounded-md',
                                "inline-flex items-center justify-center whitespace-nowrap text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-bold uppercase cursor-pointer [&>*]:text-white",
                                "bg-blue-600 text-white hover:bg-blue-600/90"
                            )}
                            text={getButtonText()}
                        />
                    </Transaction>
                )}
            </div>
            {!!address && !hasEnoughBalance() && (
                <div className="top-full text-xs mt-1 font-semibold text-center w-full">
                    You don&apos;t have enough balance
                </div>
            )}
        </div>
    )
}