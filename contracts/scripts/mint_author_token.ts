import { createWalletClient, createPublicClient, http, bytesToHex, toBytes, toHex } from "viem";

import { avalancheFuji } from 'viem/chains'
import { mnemonicToAccount } from 'viem/accounts'

//import * as fs from 'node:fs';


require('dotenv').config()


import { SUMMIT_DATA, SUMMIT_RECEIVER_DATA } from "./contracts_loader";


import { CONTRACT_ADDRESS, CCIP_TESTNET_CONTRACTS_INFO } from "./constants";
import { stringToAddress } from "./utils";
import { getContractAt } from "@nomicfoundation/hardhat-viem/types";

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

    let summitContract = await getContractAt(
        "Summit",
        CONTRACT_ADDRESS
    );

    let tokenId = await summitContract.read.createTokenId(
        [account.address, BigInt(0), false]   
    );



    /*
    const res = await wallet.writeContract({
        address: CONTRACT_ADDRESS,
        abi: contractData.abi,
        functionName: "mint",
        args: [account.address, tokenId, BigInt(1), "0x"],
        account
    })
    */

    const bnmContract = await getContractAt(
        "BnMToken",
        stringToAddress(CCIP_TESTNET_CONTRACTS_INFO.fuji.tokens["CCIP-BnM"])
    );

    let res = await bnmContract.write.transferAndCall(
        [
            "use address receiver here",
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