import { createWalletClient, createPublicClient, http } from "viem";

import { avalancheFuji } from 'viem/chains'
import { mnemonicToAccount } from 'viem/accounts'
//import { SUMMIT_ADDRESS, FUNCTION_CONSUMER } from "./constants";
import { DEV_SUMMIT_ADDRESS, DEV_FUNCTION_CONSUMER } from "./constants";

const SUMMIT_ADDRESS = DEV_SUMMIT_ADDRESS;
const FUNCTION_CONSUMER = DEV_FUNCTION_CONSUMER;

import { summitAbi } from "../generated/contractAbis";

import * as viem from "viem";

require('dotenv').config()


async function main() {
    const account = mnemonicToAccount(process.env.ADMIN_PASSPHRASE!)
    const account_new_controller = mnemonicToAccount(process.env.ACCESS_CONTROLLER_PASSPHRASE!)


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

    const res = await summitContract.write.setAccessControlAdmin(
        [FUNCTION_CONSUMER], //[account_new_controller.address],
        {
            account: account_new_controller
        }
    )

    return res
}


main().then((res) => {
    console.log(`Successfully changed access control admin with tx: ${res}`)
})