import { createWalletClient, createPublicClient, http } from "viem";

import { avalancheFuji } from 'viem/chains'
import { mnemonicToAccount } from 'viem/accounts'

import * as contractData from "../artifacts/contracts/Summit.sol/Summit.json";
import { CONTRACT_ADDRESS } from "./constants";
import { getContractAt } from "@nomicfoundation/hardhat-viem/types";

require('dotenv').config()


const NEW_URI = "";


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