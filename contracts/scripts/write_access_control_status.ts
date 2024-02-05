import { createWalletClient, createPublicClient, http } from "viem";

import { avalancheFuji } from 'viem/chains'
import { mnemonicToAccount } from 'viem/accounts'

import * as contractData from "../artifacts/contracts/Summit.sol/Summit.json";
import { CONTRACT_ADDRESS } from "./constants";
import { getContractAt } from "@nomicfoundation/hardhat-viem/types";

require('dotenv').config()


async function main() {
    const userAccount = mnemonicToAccount(process.env.USER_PASSPHRASE!!)
    const accessControllerAccount = mnemonicToAccount(process.env.ACCESS_CONTROLLER_PASSPHRASE!!)


    const wallet = createWalletClient(
        {
            account: accessControllerAccount,
            chain: avalancheFuji,
            transport: http(avalancheFuji.rpcUrls.public.http[0])
        }
    )

    let summitContract = await getContractAt(
        "Summit",
        CONTRACT_ADDRESS,
        {
            walletClient: wallet
        }
    );

    // set as banned
    const res = await summitContract.write.setAccessStatus(
        [
            userAccount.address,
            2
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