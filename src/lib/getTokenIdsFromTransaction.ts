import { createPublicClient, decodeEventLog,Hash, http, TransactionReceipt } from 'viem'
import { base } from 'viem/chains'

import { nftContractAbi } from '@/lib/nftContractAbi'

import { BaseLogoToken } from '@/app/share/[nftId]/page'

// Initialize the client
const publicClient = createPublicClient({
  chain: base,
  transport: http()
})


export async function getTokenIdsFromTransaction(
  txHash: Hash
): Promise<{ids: string[], tokens: BaseLogoToken[] }> {
  const receipt: TransactionReceipt = await publicClient.getTransactionReceipt({ hash: txHash })
  const tokenIds: bigint[] = []

  for (const log of receipt.logs) {
    try {
      // Handle standard Transfer events
      const decoded = decodeEventLog({
        abi: nftContractAbi,
        data: log.data,
        topics: log.topics
      })
      if (decoded.eventName === "TokenMinted") {
        tokenIds.push(decoded.args.tokenId)
        continue
      }
    } catch {
      // Not a standard transfer event, try batch
      try {
        const batchDecoded = decodeEventLog({
          abi: nftContractAbi,
          data: log.data,
          topics: log.topics
        })
        if (batchDecoded.eventName === "BatchMinted") {
          tokenIds.push(...batchDecoded.args.tokenIds)
        }
      } catch {
        // Not a transfer event we're interested in
        continue
      }
    }
  }

  const tokens = await Promise.all(
    tokenIds.map(async (tokenId) => {
      const uri = await publicClient.readContract({
              address: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as any,
              abi: nftContractAbi,
              functionName: 'tokenURI',
              args: [tokenId],
        })
      const resp = await fetch(uri).then(a => a.json())
      
      return resp
    }))

  return {
    ids: tokenIds.sort((a, b) => (a < b ? -1 : 1)).map(String),
    tokens
  }
}