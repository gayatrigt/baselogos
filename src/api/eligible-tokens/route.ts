// app/api/eligible-tokens/route.ts
import { NextResponse } from 'next/server'
import { Address, createPublicClient, http } from 'viem'
import { baseSepolia } from 'viem/chains'

// Note: Move these to environment variables
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as Address

// Create a singleton client instance
const client = createPublicClient({
    chain: baseSepolia,
    transport: http()
})

export async function GET(request: Request) {
    try {
        // Get quantity from query params, default to 5
        const { searchParams } = new URL(request.url)
        const quantity = Math.min(Number(searchParams.get('quantity') || 5), 5)

        const selectedTokens: number[] = []
        let currentId = 0
        const MAX_SUPPLY = 10000
        const BATCH_SIZE = 50

        while (selectedTokens.length < quantity && currentId < MAX_SUPPLY) {
            const batchPromises = []
            const batchIds = []
            
            // Create batch of promises
            for (let i = 0; i < BATCH_SIZE && currentId + i < MAX_SUPPLY; i++) {
                const tokenId = currentId + i
                batchIds.push(tokenId)
                batchPromises.push(
                    client.readContract({
                        address: CONTRACT_ADDRESS,
                        abi: [{
                            name: 'isTokenIdEligible',
                            inputs: [{ name: 'tokenId', type: 'uint256' }],
                            outputs: [{ name: '', type: 'bool' }],
                            stateMutability: 'view',
                            type: 'function'
                        }],
                        functionName: 'isTokenIdEligible',
                        args: [BigInt(tokenId)]
                    })
                )
            }

            // Wait for all checks in batch
            const results = await Promise.all(batchPromises)

            // Add eligible tokens to selection
            for (let i = 0; i < results.length; i++) {
                if (results[i] && selectedTokens.length < quantity) {
                    selectedTokens.push(batchIds[i])
                }
            }

            currentId += BATCH_SIZE
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