import { NextResponse } from 'next/server'
import { Address, createPublicClient, http } from 'viem'
import { base } from 'viem/chains'

import { nftContractAbi } from '@/lib/nftContractAbi'

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as Address
const MAX_SUPPLY = 10000
const BATCH_SIZE = 50

const client = createPublicClient({
    chain: base,
    transport: http("https://base-mainnet.g.alchemy.com/v2/LQBTxwHxVNA6YdEoWNqtFY9Z24pxAAAv")
})

function getRandomNumbers(count: number, max: number): number[] {
    const numbers = new Set<number>()
    while (numbers.size < count) {
        numbers.add(Math.floor(Math.random() * max))
    }
    return Array.from(numbers)
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const quantity = Math.min(Number(searchParams.get('quantity') || 1), 20)
        const selectedTokens: number[] = []
        const checkedTokens = new Set<number>()
        
        while (selectedTokens.length < quantity && checkedTokens.size < MAX_SUPPLY) {
            // Get a batch of random numbers we haven't checked yet
            const randomBatch = getRandomNumbers(BATCH_SIZE, MAX_SUPPLY)
                .filter(num => !checkedTokens.has(num))
            
            if (randomBatch.length === 0) continue
            
            // Add to checked tokens
            randomBatch.forEach(num => checkedTokens.add(num))
            
            // Check eligibility in batch
            const batchPromises = randomBatch.map(tokenId =>
                client.readContract({
                    address: CONTRACT_ADDRESS,
                    abi: nftContractAbi,
                    functionName: "isAvailableForMint",
                    args: [BigInt(tokenId)]
                })
            )
            
            const results = await Promise.all(batchPromises)
            
            // Add eligible tokens
            for (let i = 0; i < results.length; i++) {
                if (results[i] && selectedTokens.length < quantity) {
                    selectedTokens.push(randomBatch[i])
                }
            }
        }
        
        if (selectedTokens.length < quantity) {
            return NextResponse.json(
                { error: 'Not enough eligible tokens found' },
                { status: 400 }
            )
        }
        
        return NextResponse.json({
            tokens: selectedTokens,
            quantity: selectedTokens.length
        })
        
    } catch (error) {
        console.error('Error finding eligible tokens:', error)
        return NextResponse.json(
            { error: 'Failed to find eligible tokens' },
            { status: 500 }
        )
    }
}