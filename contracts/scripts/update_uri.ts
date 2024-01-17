import { createWalletClient, createPublicClient, http } from "viem";

import { avalancheFuji } from 'viem/chains'
import { mnemonicToAccount } from 'viem/accounts'

import * as contractData from "../artifacts/contracts/MediumAccess.sol/MediumAccess.json";
import { CONTRACT_ADDRESS } from "./constants";

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


    const res = await wallet.writeContract({
        address: CONTRACT_ADDRESS,
        abi: contractData.abi,
        functionName: "setURI",
        args: [NEW_URI],
        account
    })


    return res
}


main().then((res) => {
    console.log(`setURI succeeded. Tx hash: ${res}`)
})