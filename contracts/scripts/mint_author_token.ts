import { createWalletClient, createPublicClient, http } from "viem";

import { avalancheFuji } from 'viem/chains'
import { mnemonicToAccount } from 'viem/accounts'

//import * as fs from 'node:fs';


require('dotenv').config()

import * as contractData from "../artifacts/contracts/MediumAccess.sol/MediumAccess.json";
import { CONTRACT_ADDRESS } from "./constants";

// console.log(process.env.ADMIN_PASSPHRASE)

async function main() {
    const account = mnemonicToAccount(process.env.ADMIN_PASSPHRASE!!)
    console.log(account.address)

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

    let tokenId = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: contractData.abi,
        functionName: "createTokenId",
        args: [account.address, BigInt(0), false],  
    });

    const res = await wallet.writeContract({
        address: CONTRACT_ADDRESS,
        abi: contractData.abi,
        functionName: "mint",
        args: [account.address, tokenId, BigInt(1), "0x"],
        account
    })


    return res
}


main().then((res) => {
    console.log(`Mint succeeded. Tx hash: ${res}`)
})