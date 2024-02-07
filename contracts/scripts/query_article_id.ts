import { createWalletClient, createPublicClient, http } from "viem";

import { avalancheFuji } from 'viem/chains'
import { mnemonicToAccount } from 'viem/accounts'

import * as contractData from "../artifacts/contracts/Summit.sol/Summit.json";
import { SUMMIT_ADDRESS } from "./constants";
import { getContractAt } from "@nomicfoundation/hardhat-viem/types";
import { summitAbi } from "../generated/contractAbis";

import * as viem from "viem";

require('dotenv').config()


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

    const articleId = await summitContract.read.idTracker(
        [
            account.address
        ],
        {
            account: wallet.account
        }
    )

    return articleId
}


main().then((articleId) => {
    console.log(`Required article id for next article is: ${articleId}`)
})