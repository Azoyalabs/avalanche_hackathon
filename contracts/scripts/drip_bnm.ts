import { createWalletClient, createPublicClient, http, bytesToHex, toBytes, toHex } from "viem";

import { avalancheFuji } from 'viem/chains'
import { mnemonicToAccount } from 'viem/accounts'

//import * as fs from 'node:fs';


require('dotenv').config()



import * as bnmTokenData from "../artifacts/contracts/BnMToken.sol/BnMToken.json";

import { CCIP_TESTNET_CONTRACTS_INFO } from "./constants";
import { stringToAddress } from "./utils";

import * as viem from "viem";


async function main() {
    //const account = mnemonicToAccount(process.env.ADMIN_PASSPHRASE!!)
    const account = mnemonicToAccount(process.env.USER_PASSPHRASE!!)
    console.log(account.address)

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


    const bnmContract = viem.getContract({
        abi: bnmTokenData.abi,
        address: stringToAddress(CCIP_TESTNET_CONTRACTS_INFO.fuji.tokens["CCIP-BnM"]),
        walletClient: wallet
    })    

    const dripAbi = [{
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "drip",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }]

    let res = wallet.writeContract(
        {
            address: bnmContract.address,
            abi: dripAbi,
            functionName: "drip",
            args: [account.address],
            account
        }
    );


    return res
}


main().then((res) => {
    console.log(`Drip succeeded. Tx hash: ${res}`)
})