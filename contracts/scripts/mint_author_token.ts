import { createWalletClient, createPublicClient, http, bytesToHex, toBytes, toHex } from "viem";

import { avalancheFuji } from 'viem/chains'
import { mnemonicToAccount } from 'viem/accounts'

//import * as fs from 'node:fs';


require('dotenv').config()


//import { SUMMIT_DATA, SUMMIT_RECEIVER_DATA } from "./contracts_loader";
import * as bnmTokenData from "../artifacts/contracts/BnMToken.sol/BnMToken.json";

import * as SUMMIT_DATA from "../artifacts/contracts/Summit.sol/Summit.json";

import { SUMMIT_ADDRESS, RECEIVER_ADDRESS, CCIP_TESTNET_CONTRACTS_INFO } from "./constants";
import { stringToAddress } from "./utils";
import { getContractAt } from "@nomicfoundation/hardhat-viem/types";

import * as viem from "viem";
import { SUMMIT_ABI } from "./contracts_loader";

import { abi as summitoAbi } from "../artifacts/contracts/Summit.sol/Summit.json";

import { summitAbi } from "../generated/contractAbis";

async function main() {
    const account = mnemonicToAccount(process.env.ADMIN_PASSPHRASE!!)

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

    console.log(tokenId)


    /*
    const res = await wallet.writeContract({
        address: CONTRACT_ADDRESS,
        abi: contractData.abi,
        functionName: "mint",
        args: [account.address, tokenId, BigInt(1), "0x"],
        account
    })
    */
    const bnmContract = viem.getContract({
        abi: bnmTokenData.abi,
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


    return res
}


main().then((res) => {
    console.log(`Mint succeeded. Tx hash: ${res}`)
})