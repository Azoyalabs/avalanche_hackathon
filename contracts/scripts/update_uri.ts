import { createWalletClient, createPublicClient, http } from "viem";

import { avalancheFuji } from 'viem/chains'
import { mnemonicToAccount } from 'viem/accounts'

import * as contractData from "../artifacts/contracts/Summit.sol/Summit.json";
import { SUMMIT_ADDRESS } from "./constants";
import { getContractAt } from "@nomicfoundation/hardhat-viem/types";
import { summitAbi } from "../generated/contractAbis";

import * as viem from "viem";

require('dotenv').config()


const NEW_URI = "https://avalanche-hackathon-web.vercel.app/api/nfts/";


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
        walletClient: wallet,
        publicClient: publicClient
    })


    const res = await summitContract.write.setURI(
        [NEW_URI],
        {
            account: wallet.account
        }
    );

    return res
}


main().then((res) => {
    console.log(`setURI succeeded. Tx hash: ${res}`)
})