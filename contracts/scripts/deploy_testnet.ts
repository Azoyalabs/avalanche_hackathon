import { viem } from "hardhat";
import { getAddress, parseGwei, Account, createWalletClient } from "viem";

import { avalancheFuji } from 'viem/chains'

import { http } from 'viem'


import { mnemonicToAccount } from 'viem/accounts'

//import * as fs from 'node:fs';


require('dotenv').config()

import * as contractData from "../artifacts/contracts/Summit.sol/Summit.json";

// console.log(process.env.ADMIN_PASSPHRASE)

async function main() {
    const account = mnemonicToAccount(process.env.ADMIN_PASSPHRASE!!)
    console.log(account.address)

    const wallet = createWalletClient(
        {
            account: account,
            chain: avalancheFuji,
            transport: http(avalancheFuji.rpcUrls.public.http[0])
        }
    )

    /*
    // read contract bytecode 
    const bytecode = fs.readFileSync("artifacts/contracts/MediumAccess.sol", "binary");

    // read abi 
    const abi = JSON.parse(fs.readFileSync("../bin/contracts/MediumAccess.abi", "utf-8"))
    */


    let res = await wallet.deployContract(
        {
            abi: contractData.abi, //abi,
            account,
            args: [account.address, BigInt(100)],
            bytecode: `0x${contractData.bytecode.slice(2, contractData.bytecode.length)}` //`0x${bytecode}`
        }
    )

    return res
}


main().then((res) => {
    console.log(`Instantiation succeeded. Tx hash: ${res}`)
})