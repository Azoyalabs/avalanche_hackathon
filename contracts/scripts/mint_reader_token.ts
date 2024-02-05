import { createWalletClient, createPublicClient, http, toHex } from "viem";

import { avalancheFuji } from 'viem/chains'
import { mnemonicToAccount } from 'viem/accounts'

//import * as fs from 'node:fs';


require('dotenv').config()

import * as contractData from "../artifacts/contracts/Summit.sol/Summit.json";
import { CCIP_TESTNET_CONTRACTS_INFO, CONTRACT_ADDRESS } from "./constants";
import { getContractAt } from "@nomicfoundation/hardhat-viem/types";
import { stringToAddress } from "./utils";

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

    let summitContract = await getContractAt(
        "Summit",
        CONTRACT_ADDRESS
    );

    // use write account here instead of admin 
    let tokenId = await summitContract.read.createTokenId(
        [admin_account.address, BigInt(0), false]   
    );
    

    // get mint price if it's a paid article 
    let _mint_price = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: contractData.abi,
        functionName: "mintPrice",
        args: []
    }) 

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