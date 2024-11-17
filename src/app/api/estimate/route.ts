// app/api/estimate-overlay/route.ts
import fs from 'fs';
import path from 'path';
import { BaseError, createPublicClient, http, parseGwei, formatEther, PublicClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';

import { nftContractAbi } from '@/lib/nftContractAbi';

const CHUNK_SIZE = 20000/2;

function splitIntoChunks(str: string, size: number): string[] {
  const chunks = [];
  for (let i = 0; i < str.length; i += size) {
    chunks.push(str.slice(i, i + size));
  }
  return chunks;
}

async function estimateChunkCost({
  publicClient,
  account,
  contractAddress,
  chunkIndex,
  chunkData,
}: {
  publicClient: PublicClient;
  account: `0x${string}`;
  contractAddress: `0x${string}`;
  chunkIndex: number;
  chunkData: string;
}) {
  // Get latest block for gas calculations
  const block = await publicClient.getBlock({ blockTag: 'latest' });
  const baseFee = block.baseFeePerGas || parseGwei('0.001');
  const maxPriorityFeePerGas = parseGwei('2');
  const maxFeePerGas = baseFee * 2n + maxPriorityFeePerGas;

  // Simulate the contract call to get the request data
  const { request } = await publicClient.simulateContract({
    account,
    address: contractAddress,
    abi: nftContractAbi,
    functionName: 'setOverlayChunk',
    args: [BigInt(chunkIndex), chunkData],
    maxFeePerGas,
    maxPriorityFeePerGas,
  });

  // Estimate gas
  const gasEstimate = await publicClient.estimateGas({
    account,
    to: contractAddress,
    data: request.data,
    maxFeePerGas,
    maxPriorityFeePerGas,
  });

  // Calculate total cost for this chunk
  const totalCost = gasEstimate * maxFeePerGas;

  return {
    gasEstimate,
    maxFeePerGas,
    maxPriorityFeePerGas,
    totalCost,
    formattedTotalCost: formatEther(totalCost),
  };
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

    // Create Viem client
    const publicClient = createPublicClient({
      chain: base,
      transport: http(rpcUrl),
    });

    const account = privateKeyToAccount(privateKey as `0x${string}`);
    
    // Get current balance
    const balance = await publicClient.getBalance({ 
      address: account.address 
    });

    // Read the PNG file from public directory
    const imagePath = path.join(process.cwd(), 'public', 'base-overlay-optimised.png');
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Data = imageBuffer.toString('base64');
    
    // Split into chunks
    const chunks = splitIntoChunks(base64Data, CHUNK_SIZE);
    
    // Estimate costs for each chunk
    const estimates = [];
    let totalGasEstimate = 0n;
    let totalCostEstimate = 0n;

    for (let i = 0; i < chunks.length; i++) {
      const estimate = await estimateChunkCost({
        publicClient,
        account: account.address,
        contractAddress,
        chunkIndex: i,
        chunkData: chunks[i],
      });

      totalGasEstimate += estimate.gasEstimate;
      totalCostEstimate += estimate.totalCost;

      estimates.push({
        chunkIndex: i,
        ...estimate,
      });
    }

    // Calculate if we have sufficient funds
    const isBalanceSufficient = balance >= totalCostEstimate;

    return Response.json({
      success: true,
      totalChunks: chunks.length,
      estimates: {
        perChunk: estimates,
        total: {
          gasEstimate: totalGasEstimate.toString(),
          totalCost: formatEther(totalCostEstimate),
          balance: formatEther(balance),
          isBalanceSufficient,
          missingFunds: isBalanceSufficient ? '0' : formatEther(totalCostEstimate - balance),
        }
      }
    });

  } catch (error) {
    console.error(error);
    return Response.json({
      error: 'Internal server error',
      details: error instanceof BaseError ? error.message : String(error),
    }, { status: 500 });
  }
}