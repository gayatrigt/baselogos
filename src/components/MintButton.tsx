"use client"


import { LifecycleStatus, Transaction, TransactionButton } from '@coinbase/onchainkit/transaction';
// import { useRouter } from "next/router";
// import { nftContractAbi } from "~/utils/abi";
// import { wagmiConfig } from '~/utils/rainbowConfig';
// import { useNftMintCheck } from "~/utils/useNftMintCheck";
// import { toast } from "./ui/use-toast";
// import { Call } from 'node_modules/@coinbase/onchainkit/esm/transaction/types';
import { twMerge } from "tailwind-merge";
import { encodeFunctionData, formatEther } from "viem";
import { useAccount, useSwitchChain } from "wagmi";
import { baseSepolia } from 'wagmi/chains';

import { nftContractAbi } from '@/lib/nftContractAbi';
import { useNftMintCheck } from '@/lib/useNftMintCheck';

import WalletConnectionButton from '@/components/buttons/WalletConnectionButton';
// import { Button } from './ui/button';
// import useWalletPopupStore from '~/stores/useWalletPopupStore';

const nftContractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
// const higherTokenAddress = env.NEXT_PUBLIC_ALT_PAYMENT_CONTRACT_ADDRESS;


export function MintButton() {
    // const { setSidebarMode, } = useColorStore();
    // const { setOpen: setWalletPopup } = useWalletPopupStore()
    // const { setTextValue } = useMintStore()
    const {mintPrice, balance, hasEnoughBalance,} = useNftMintCheck()
    const { switchChain } = useSwitchChain()
    const account = useAccount()

    const { address } = useAccount()

    // const router = useRouter()

    // const publicClient = usePublicClient({
    //     chainId: base.id,
    //     config: wagmiConfig
    // })

    // const { textValue: mintText } = useMintStore()
    // const validWordReq = useReadContract({
    //     address: nftContractAddress as any,
    //     abi: nftContractAbi,
    //     functionName: 'wordVerify',
    //     args: [mintText.map(text => text.trim().toUpperCase())]
    // })
    const getButtonText = () => {
        if (!hasEnoughBalance()) return "Insufficient Balance";
        return `Mint for ${mintPrice && formatEther(mintPrice)} ETH`;
    }

    // const getTokenUriFromHash = async (hash: string) => {

    //     const receipt = await publicClient.waitForTransactionReceipt({ hash: hash as any });

    //     if (!receipt) {
    //         throw new Error('Transaction failed');
    //     }

    //     // Find the Transfer event in the logs
    //     const transferLog = receipt.logs.find((log) => {

    //         try {
    //             const event = decodeEventLog({
    //                 abi: nftContractAbi,
    //                 data: log.data,
    //                 topics: log.topics,
    //             })
    //             return event.eventName === 'Transfer' && (event.args as any)?.from === '0x0000000000000000000000000000000000000000'
    //         } catch {
    //             return false
    //         }
    //     })

    //     if (!transferLog) {
    //         throw new Error('No mint Transfer event found in the transaction')
    //     }

    //     // Parse the Transfer event to get the token ID
    //     const event = decodeEventLog({
    //         abi: nftContractAbi,
    //         data: transferLog.data,
    //         topics: transferLog.topics,
    //     })
    //     const tokenId: number = (event.args as any)?.tokenId


    //     // Get the token URI
    //     const tokenURI = await publicClient.readContract({
    //         address: nftContractAddress as any,
    //         abi: nftContractAbi,
    //         functionName: 'tokenURI',
    //         args: [tokenId],
    //     })


    //     if (!tokenURI) {
    //         throw new Error('Failed to fetch token URI')
    //     }

    //     // Fetch the JSON from the URI
    //     const tokenData = await fetch(tokenURI as string).then(response => response.json())

    //     return { tokenId, tokenURI, tokenData }
    // }

    const handleOnStatus = async (status: LifecycleStatus) => {
        // setSidebarMode("loading");

        if (status.statusName !== 'success') {
            return
        }

        const hash = status.statusData.transactionReceipts[0]?.transactionHash

        if (!hash) {
            return;
        }

        try {
            // const tokenDataRes = await getTokenUriFromHash(hash)
            // setMintedNftMetadata(tokenDataRes.tokenData)

            // await fetchOwnedArrows(account.address as any);
            // setSidebarMode("success");

            // router.push(`/canvas?panel=text&tokenid=${tokenDataRes.tokenId}`)
            // setSidebarMode("success");
            // setTextValue([])
        } catch (error) {
            console.error(error);

            // setSidebarMode("mint");

            const showToUser = (error as any).showToUser;
            const errorMessage = (error as any).message;
            // toast(
            //     showToUser ? {
            //         variant: "destructive",
            //         title: errorMessage,
            //     } : {
            //         variant: "destructive",
            //         title: 'Something went wrong.',
            //         description: 'Could not mint NFT, please try again later.'
            //     }
            // );
        }
    }

    const tokenId = 1

    const encodedData = encodeFunctionData({
        abi: nftContractAbi,
        functionName: 'mint',
        args: [BigInt(tokenId)],
    });

    const mintContractCalls: any[] = [
        {
            // base sepolia
            to: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as any,

            // base mainnet
            // to: "0xdFaebb66DFeef3b7EfE3e1C6Be0e1d5448E5Ff7d",

            data: encodedData,
            value: mintPrice as any,
        },
    ];

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
                    chainId={baseSepolia.id}
                    calls={mintContractCalls}
                    onStatus={handleOnStatus}
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
