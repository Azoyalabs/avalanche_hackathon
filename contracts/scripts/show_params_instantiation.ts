import { getAddress, parseGwei, Account, createWalletClient, getContractAddress, createPublicClient } from "viem";

import { avalancheFuji } from 'viem/chains'

import { http } from 'viem'
import * as viem from 'viem';

import { mnemonicToAccount } from 'viem/accounts'



require('dotenv').config()


import { SUMMIT_DATA, SUMMIT_RECEIVER_DATA } from "./contracts_loader";


import { CCIP_TESTNET_CONTRACTS_INFO } from "./constants";

// changer ID dans le contrat
const URI = "https://avalanche-hackathon-web.vercel.app/api/nfts/" 


async function main() {
    const account = mnemonicToAccount(process.env.ADMIN_PASSPHRASE!!)
    const accessController = mnemonicToAccount(process.env.ADMIN_PASSPHRASE!!)


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






    console.log(`Account address: ${account.address}`)
    console.log(`Access controller address: ${accessController.address}`)
    console.log(`URI: ${URI}`)




}


main()
