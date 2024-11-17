// app/api/chunk-overlay/route.ts
import fs from 'fs';
import path from 'path';
import { BaseError,createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';

import { nftContractAbi } from '@/lib/nftContractAbi';

const CHUNK_SIZE = 20000; // ~24KB per chunk

function splitIntoChunks(str: string, size: number): string[] {
  const chunks = [];
  for (let i = 0; i < str.length; i += size) {
    chunks.push(str.slice(i, i + size));
  }
  return chunks;
}

export async function GET() {
  try {
    const contractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
    
    if (!contractAddress) {
      return Response.json(
        { error: 'Missing contract address' },
        { status: 400 }
      );
    }

    // Get environment variables
    const rpcUrl = base.rpcUrls.default.http[0];
    const privateKey = "0x" + process.env.PRIVATE_KEY;

    if (!rpcUrl || !privateKey) {
      return Response.json(
        { error: 'Missing environment configuration' },
        { status: 500 }
      );
    }

    // Create Viem clients
    const publicClient = createPublicClient({
      chain: base,
      transport: http(rpcUrl),
    });

    // get getOverlayChunk and getOverlayCount from the contract
    // const getOverlayChunk = await publicClient.readContract({
    //   address: contractAddress,
    //   abi: nftContractAbi,
    //   functionName: 'getOverlayChunk',
    // });
    // console.log("🚀 ~ GET ~ getOverlayChunk:", getOverlayChunk)

    const getOverlayCount = await publicClient.readContract({
      address: contractAddress,
      abi: nftContractAbi,
      functionName: "getChunkCount",
    });
    console.log("🚀 ~ GET ~ getOverlayCount:", getOverlayCount)


    const account = privateKeyToAccount(privateKey as `0x${string}`);
    
    const walletClient = createWalletClient({
      account,
      chain: base,
      transport: http(rpcUrl),
    });

    // Check if signer is contract owner
    const contractOwner = await publicClient.readContract({
      address: contractAddress,
      abi: nftContractAbi,
      functionName: 'owner',
    });

    if (contractOwner.toLowerCase() !== account.address.toLowerCase()) {
      return Response.json(
        { error: 'Signer must be contract owner' },
        { status: 403 }
      );
    }

    // Read the PNG file from public directory
    const imagePath = path.join(process.cwd(), 'public', 'base-overlay-optimised.png');
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Data = imageBuffer.toString('base64');
    
    // Split into chunks
    const chunks = splitIntoChunks(base64Data, CHUNK_SIZE);
    console.log("🚀 ~ GET ~ chunks:", chunks.length)

    const nonce = await publicClient.getTransactionCount({
      address: account.address,
    });
    
    // Upload chunks
    const transactions = [];
    
    for (let i = 0; i < chunks.length; i++) {
      try {
        console.log("🚀 ~ GET ~ start", i +'/' +chunks.length)
        // Simulate transaction before sending
        const { request } = await publicClient.simulateContract({
          account,
          address: contractAddress,
          abi: nftContractAbi,
          functionName: 'setOverlayChunk',
          args: [BigInt(i), chunks[i]],
        });

        // Send transaction
        const hash = await walletClient.writeContract({
          ...request,
          account,
          chain: request.chain,
          nonce: Number(BigInt(nonce) + BigInt(i)), // Increment nonce for each transaction
        });
        
        // Wait for confirmation
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        transactions.push({
          chunk: i + 1,
          hash: receipt.transactionHash,
        });
        console.log("🚀 ~ GET ~ done", i +'/' +chunks.length)
        
        // Add delay between chunks
        if (i < chunks.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(error)
        return Response.json({
          error: `Failed to upload chunk ${i + 1}`,
          details: error instanceof BaseError ? error.message : String(error),
          completedTransactions: transactions,
        }, { status: 500 });
      }
    }

    // Get final chunk count
    const chunkCount = await publicClient.readContract({
      address: contractAddress,
      abi: nftContractAbi,
      functionName: 'getChunkCount',
    });

    return Response.json({
      success: true,
      totalChunks: chunks.length,
      chunkCount: Number(chunkCount),
      // transactions,
    });

  } catch (error) {
    console.error(error);
    return Response.json({
      error: 'Internal server error',
      details: error instanceof BaseError ? error.message : String(error),
    }, { status: 500 });
  }
}