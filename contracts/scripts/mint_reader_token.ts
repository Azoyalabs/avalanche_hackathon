import { createWalletClient, createPublicClient, http } from "viem";

import { avalancheFuji } from 'viem/chains'
import { mnemonicToAccount } from 'viem/accounts'

//import * as fs from 'node:fs';


require('dotenv').config()

import * as contractData from "../artifacts/contracts/MediumAccess.sol/MediumAccess.json";
import { CONTRACT_ADDRESS } from "./constants";

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


    let tokenId = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: contractData.abi,
        functionName: "createTokenId",
        args: [admin_account.address, BigInt(0), false],  // creator address, article id, is_paying
    });

    // get mint price if it's a paid article 
    let _mint_price = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: contractData.abi,
        functionName: "mintPrice",
        args: []
    }) 


    const res = await wallet.writeContract({
        address: CONTRACT_ADDRESS,
        abi: contractData.abi,
        functionName: "mint",
        args: [user_account.address, tokenId, BigInt(1), "0x"],
        account: user_account
    })


    return res
}


main().then((res) => {
    console.log(`Mint succeeded. Tx hash: ${res}`)
})