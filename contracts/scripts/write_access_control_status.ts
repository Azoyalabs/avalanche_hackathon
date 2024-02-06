import { createWalletClient, createPublicClient, http } from "viem";

import { avalancheFuji } from 'viem/chains'
import { mnemonicToAccount } from 'viem/accounts'

import * as contractData from "../artifacts/contracts/Summit.sol/Summit.json";
import { SUMMIT_ADDRESS } from "./constants";
import { getContractAt } from "@nomicfoundation/hardhat-viem/types";

import * as viem from "viem";
import { SUMMIT_DATA } from "./contracts_loader";

require('dotenv').config()


async function main() {
    const userAccount = mnemonicToAccount(process.env.USER_PASSPHRASE!!)
    const accessControllerAccount = mnemonicToAccount(process.env.ADMIN_PASSPHRASE!!);   //process.env.ACCESS_CONTROLLER_PASSPHRASE!!)


    const wallet = createWalletClient(
        {
            account: accessControllerAccount,
            chain: avalancheFuji,
            transport: http(avalancheFuji.rpcUrls.public.http[0])
        }
    )

    let summitContract = viem.getContract({
        abi: SUMMIT_DATA.abi,
        address: SUMMIT_ADDRESS,
        walletClient: wallet
        //publicClient: publicClient
    })
    // set as allowed
    const res = await summitContract.write.setAccessStatus(
        [
            accessControllerAccount.address,
            1
        ],
        {
            account: wallet.account
        }
    )

    return res
}


main().then((res) => {
    console.log(`Access status modified with tx: ${res}`)
})