import { createWalletClient, createPublicClient, http, bytesToHex, toBytes, toHex } from "viem";

import { avalancheFuji } from 'viem/chains'
import { mnemonicToAccount } from 'viem/accounts'



require('dotenv').config()


import { SUMMIT_ADDRESS, RECEIVER_ADDRESS, CCIP_TESTNET_CONTRACTS_INFO } from "./constants";
import { stringToAddress } from "./utils";

import * as viem from "viem";


import { bnMTokenAbi, summitAbi } from "../generated/contractAbis";

async function main() {
    const account = mnemonicToAccount(process.env.ADMIN_PASSPHRASE!)

    const publicClient = createPublicClient({
        chain: avalancheFuji,
        transport: http(avalancheFuji.rpcUrls.public.http[0])
    })

    const wallet = createWalletClient(
        {
            account: account,
            chain: avalancheFuji,
            transport: http(avalancheFuji.rpcUrls.public.http[0])
        }
    )


    let summitContract = viem.getContract({
        abi: summitAbi, //SUMMIT_ABI, //SUMMIT_DATA.abi,
        address: SUMMIT_ADDRESS,
        publicClient: publicClient,
        walletClient: wallet
        //publicClient: publicClient
    })

    let tokenId = await summitContract.read.createTokenId(
        [account.address, BigInt(0), false]   
    );



    const bnmContract = viem.getContract({
        abi: bnMTokenAbi,
        address: stringToAddress(CCIP_TESTNET_CONTRACTS_INFO.fuji.tokens["CCIP-BnM"]),
        walletClient: wallet
    })    


    let res = await bnmContract.write.transferAndCall(
        [
            RECEIVER_ADDRESS,
            BigInt(0),
            bytesToHex(toBytes(tokenId))   
            //toHex(tokenId)         
        ]
    )


    return { res, tokenId }
}


main().then((res) => {
    console.log(`Mint succeeded. Tx hash: ${res.res}, Token Id: ${res.tokenId}`)
})