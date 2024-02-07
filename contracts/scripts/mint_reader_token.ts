import { createWalletClient, createPublicClient, http, toHex } from "viem";

import { avalancheFuji } from 'viem/chains'
import { mnemonicToAccount } from 'viem/accounts'

//import * as fs from 'node:fs';


require('dotenv').config()

import { CCIP_TESTNET_CONTRACTS_INFO, RECEIVER_ADDRESS, SUMMIT_ADDRESS } from "./constants";
import { stringToAddress } from "./utils";
import { bnMTokenAbi, summitAbi } from "../generated/contractAbis";

import * as viem from "viem";

// console.log(process.env.ADMIN_PASSPHRASE)

async function main() {
    const admin_account = mnemonicToAccount(process.env.ADMIN_PASSPHRASE!!, {
        //changeIndex: 1
    })

    const user_account = mnemonicToAccount(process.env.USER_PASSPHRASE!!, {
        //changeIndex: 1
    })
    
    //console.log(account.address)

    const wallet = createWalletClient(
        {
            account: user_account,
            chain: avalancheFuji,
            transport: http(avalancheFuji.rpcUrls.public.http[0])
        }
    )

    //console.log(await wallet.getAddresses())

    const publicClient = createPublicClient({
        chain: avalancheFuji,
        transport: http(avalancheFuji.rpcUrls.public.http[0])
    })

    let summitContract = viem.getContract({
        abi: summitAbi, //SUMMIT_ABI, //SUMMIT_DATA.abi,
        address: SUMMIT_ADDRESS,
        walletClient: wallet,
        publicClient: publicClient
    })

    // use write account here instead of admin 
    let tokenId = await summitContract.read.createTokenId(
        [admin_account.address, BigInt(0), false]   
    );
    

    // get mint price if it's a paid article 
    let _mint_price = await summitContract.read.mintPrice();

    const bnmContract = viem.getContract({
        abi: bnMTokenAbi, //SUMMIT_ABI, //SUMMIT_DATA.abi,
        address: stringToAddress(CCIP_TESTNET_CONTRACTS_INFO.fuji.tokens["CCIP-BnM"]),
        walletClient: wallet,
        publicClient: publicClient
    }) 
    
    let res = await bnmContract.write.transferAndCall(
        [
            RECEIVER_ADDRESS,
            BigInt(0),
            //bytesToHex(toBytes(tokenId))   
            toHex(tokenId)         
        ]
    )


    return res
}


main().then((res) => {
    console.log(`Mint succeeded. Tx hash: ${res}`)
})