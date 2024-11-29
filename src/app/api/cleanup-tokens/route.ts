// app/api/cleanup-tokens/route.ts
import { promises as fs } from 'fs'
import { NextResponse } from 'next/server'
import path from 'path'
import { Address, createPublicClient, http } from 'viem'
import { base } from 'viem/chains'

import { nftContractAbi } from '@/lib/nftContractAbi'

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as Address
const BATCH_SIZE = 50 // Reduced batch size for better reliability
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second
const BATCH_DELAY = 500 // 500ms between batches to avoid rate limits

const client = createPublicClient({
    chain: base,
    transport: http("https://base-mainnet.g.alchemy.com/v2/LQBTxwHxVNA6YdEoWNqtFY9Z24pxAAAv", {
        timeout: 30000, // 30 second timeout
        retryCount: 3,
        retryDelay: 1000,
    })
})

const isAuthenticated = (request: Request) => {
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.CRON_SECRET
    return authHeader === `Bearer ${expectedToken}`
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

async function checkEligibilityWithRetry(tokenId: number): Promise<boolean> {
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            const result = await client.readContract({
                address: CONTRACT_ADDRESS,
                abi: nftContractAbi,
                functionName: "isAvailableForMint",
                args: [BigInt(tokenId)]
            })
            return result
        } catch (error) {
            if (attempt === MAX_RETRIES - 1) throw error
            await sleep(RETRY_DELAY)
        }
    }
    return false
}

export async function GET(request: Request) {
    try {
        if (!isAuthenticated(request)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Read the token IDs file
        const filePath = path.join(process.cwd(), 'src', 'lib', 'tokenIds.json')
        const fileContent = await fs.readFile(filePath, 'utf-8')
        const { tokens } = JSON.parse(fileContent)

        if (!Array.isArray(tokens)) {
            throw new Error('Invalid tokens data structure')
        }

        console.log(`Starting cleanup of ${tokens.length} tokens`)
        const startTime = Date.now()
        const eligibleTokens: number[] = []
        const errors: { tokenId: number; error: string }[] = []
        
        // Process tokens in batches
        for (let i = 0; i < tokens.length; i += BATCH_SIZE) {
            const batch = tokens.slice(i, i + BATCH_SIZE)
            
            // Process batch with individual retries
            const batchResults = await Promise.allSettled(
                batch.map(tokenId => checkEligibilityWithRetry(tokenId))
            )

            // Process results and track errors
            batchResults.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value) {
                    eligibleTokens.push(batch[index])
                } else if (result.status === 'rejected') {
                    errors.push({
                        tokenId: batch[index],
                        error: result.reason?.message || 'Unknown error'
                    })
                }
            })

            // Progress logging
            console.log(`Processed ${i + batch.length}/${tokens.length} tokens`)
            
            // Add delay between batches
            if (i + BATCH_SIZE < tokens.length) {
                await sleep(BATCH_DELAY)
            }
        }

        // Write the updated list back to the file
        await fs.writeFile(
            filePath,
            JSON.stringify({ tokens: eligibleTokens }, null, 2)
        )

        const duration = (Date.now() - startTime) / 1000 // Duration in seconds

        return NextResponse.json({
            success: true,
            originalCount: tokens.length,
            remainingCount: eligibleTokens.length,
            removedCount: tokens.length - eligibleTokens.length,
            errorCount: errors.length,
            durationSeconds: duration,
            errors: errors.length > 0 ? errors : undefined
        })

    } catch (error) {
        console.error('Error cleaning up tokens:', error)
        return NextResponse.json(
            { 
                error: 'Failed to clean up tokens',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}

// Add POST method to prevent other HTTP methods
export async function POST() {
    return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
    )
}