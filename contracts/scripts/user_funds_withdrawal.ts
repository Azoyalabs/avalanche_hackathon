import { createWalletClient, createPublicClient, http } from "viem";

import { avalancheFuji } from 'viem/chains'
import { mnemonicToAccount } from 'viem/accounts'
import { SUMMIT_ADDRESS } from "./constants";
import { summitAbi } from "../generated/contractAbis";

import * as viem from "viem";

require('dotenv').config()


async function main() {
    const account = mnemonicToAccount(process.env.ADMIN_PASSPHRASE!!)

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
        walletClient: wallet
        //publicClient: publicClient
    })

    const res = await summitContract.write.withdraw(
        {
            account: wallet.account
        }
    )

    return res
}


main().then((res) => {
    console.log(`Successful withdrawal with tx: ${res}`)
})