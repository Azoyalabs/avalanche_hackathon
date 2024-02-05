import { createWalletClient, createPublicClient, http } from "viem";

import { avalancheFuji } from 'viem/chains'
import { mnemonicToAccount } from 'viem/accounts'

import * as contractData from "../artifacts/contracts/Summit.sol/Summit.json";
import { CONTRACT_ADDRESS } from "./constants";
import { getContractAt } from "@nomicfoundation/hardhat-viem/types";

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

    let summitContract = await getContractAt(
        "Summit",
        CONTRACT_ADDRESS,
        {
            walletClient: wallet
        }
    );

    const accessStatus = await summitContract.read.accessStatusTracker(
        [
            account.address
        ],
        {
            account: wallet.account
        }
    )

    return accessStatus
}


main().then((accessStatus) => {
    console.log(`Access status for account is: ${accessStatus}`)
})