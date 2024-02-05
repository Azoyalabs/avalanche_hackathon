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