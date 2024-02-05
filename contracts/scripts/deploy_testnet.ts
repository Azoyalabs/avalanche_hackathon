import { viem } from "hardhat";
import { getAddress, parseGwei, Account, createWalletClient, getContractAddress } from "viem";

import { avalancheFuji } from 'viem/chains'

import { http } from 'viem'


import { mnemonicToAccount } from 'viem/accounts'

//import * as fs from 'node:fs';


require('dotenv').config()

import * as summitContractData from "../artifacts/contracts/Summit.sol/Summit.json";

import * as tokenReceiverData from "../artifacts/contracts/SummitReceiver.sol/SummitReceiver.json";

// console.log(process.env.ADMIN_PASSPHRASE)

import { CCIP_TESTNET_CONTRACTS_INFO } from "./constants";
import { getTransactionReceipt } from "viem/_types/actions/public/getTransactionReceipt";

async function main() {
    const account = mnemonicToAccount(process.env.ADMIN_PASSPHRASE!!)
    const accessController = mnemonicToAccount(process.env.ADMIN_PASSPHRASE!!)

    const wallet = createWalletClient(
        {
            account: account,
            chain: avalancheFuji,
            transport: http(avalancheFuji.rpcUrls.public.http[0])
        }
    )

    // deploy the token receiver 
    let txHash = await wallet.deployContract(
        {
            abi: tokenReceiverData.abi,
            account,
            args: [
                CCIP_TESTNET_CONTRACTS_INFO.fuji.router, 
                "0x0000000000000000000000000000000000000000", 
                CCIP_TESTNET_CONTRACTS_INFO.fuji.tokens["CCIP-BnM"]
            ],
            bytecode: `0x${tokenReceiverData.bytecode.slice(2, tokenReceiverData.bytecode.length)}`
        }
    )

    // get instantiation address 
    let receipt = await getTransactionReceipt(
        wallet,
        {
            hash: txHash
        }
    );

    let receiverAddress = receipt.contractAddress;
    


    let txHashSummit = await wallet.deployContract(
        {
            abi: summitContractData.abi, //abi,
            account,
            args: [account.address, accessController.address, receiverAddress, BigInt(100), "INSERT_URI_HERE"],
            // need to prune 0x from bytecode to satisfy type requirement 
            bytecode: `0x${summitContractData.bytecode.slice(2, summitContractData.bytecode.length)}` //`0x${bytecode}`
        }
    )

    // get instantiation address 
    let receiptSummit = await getTransactionReceipt(
        wallet,
        {
            hash: txHashSummit
        }
    );

    let summitAddress = receiptSummit.contractAddress;


    // update target in receiver 
    let receiverContract = await viem.getContractAt("SummitReceiver", receiverAddress!);
    await receiverContract.write.updateTarget([summitAddress!]);


    return {
        summitAddress,
        receiverAddress
    }
}


main().then((res) => {
    console.log(`Instantiation succeeded. Tx hash: ${res}`)
})