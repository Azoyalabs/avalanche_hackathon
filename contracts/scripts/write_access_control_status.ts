import { createWalletClient, createPublicClient, http } from "viem";

import { avalancheFuji } from 'viem/chains'
import { mnemonicToAccount } from 'viem/accounts'

import { SUMMIT_ADDRESS } from "./constants";

import { summitAbi } from "../generated/contractAbis";

import * as viem from "viem";

require('dotenv').config()


async function main() {
    const userAccount = mnemonicToAccount(process.env.USER_PASSPHRASE!)
    const adminAccount = mnemonicToAccount(process.env.ADMIN_PASSPHRASE!);   //process.env.ACCESS_CONTROLLER_PASSPHRASE!!)
    const accessControllerAccount = mnemonicToAccount(process.env.ACCESS_CONTROLLER_PASSPHRASE!);   //process.env.ACCESS_CONTROLLER_PASSPHRASE!!)


    const wallet = createWalletClient(
        {
            account: accessControllerAccount,
            chain: avalancheFuji,
            transport: http(avalancheFuji.rpcUrls.public.http[0])
        }
    )

    let summitContract = viem.getContract({
        abi: summitAbi,
        address: SUMMIT_ADDRESS,
        walletClient: wallet
        //publicClient: publicClient
    })
    // set as allowed
    const res = await summitContract.write.setAccessStatus(
        [
            "0xbE54579BBF62B543F270b89505DE3A4A9f143E7A", //accessControllerAccount.address,
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