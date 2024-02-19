import { getAddress, parseGwei, Account, createWalletClient, getContractAddress, createPublicClient } from "viem";

import { avalancheFuji } from 'viem/chains'

import { http } from 'viem'
import * as viem from 'viem';

import { mnemonicToAccount } from 'viem/accounts'



require('dotenv').config()


import { FUNCTION_CONSUMER_DATA } from "./contracts_loader";


import { CCIP_TESTNET_CONTRACTS_INFO, DEV_SUMMIT_ADDRESS } from "./constants";
const SUMMIT_ADDRESS = DEV_SUMMIT_ADDRESS;

const FUNCTION_ROUTER_ADDRESS = "0xA9d587a00A31A52Ed70D6026794a8FC5E2F5dCb0";


async function main() {
    const account = mnemonicToAccount(process.env.ADMIN_PASSPHRASE!!)
    const accessController = mnemonicToAccount(process.env.ACCESS_CONTROLLER_PASSPHRASE!!)

    console.log(`admin address: ${account.address}`)
    console.log(`access controller address: ${accessController.address}`)


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


    // deploy the token receiver 
    let txHash = await wallet.deployContract(
        {
            abi: FUNCTION_CONSUMER_DATA.abi,
            account,
            args: [
                FUNCTION_ROUTER_ADDRESS,
                SUMMIT_ADDRESS
            ],
            bytecode: FUNCTION_CONSUMER_DATA.bytecode as `0x{string}`
        }
    )


    // get instantiation address 
    let receipt = await publicClient.waitForTransactionReceipt(
        {
            hash: txHash
        }
    );

    let functionConsumerAddress = receipt!.contractAddress;



    // perform verification after deployment? 
    // https://blog.chain.link/how-to-verify-smart-contract-on-etherscan-hardhat/

    //const verify_command = `npx hardhat verify --network snowtrace ${summitAddress} "${account.address}" "${accessController.address}" "${receiverAddress}" "100" "${URI}"`

    return {
        functionConsumerAddress,
        //receiverAddress,
        //verify_command
    }
}


main().then((res) => {
    console.log(`Instantiation succeeded. Function consumer at address: ${res.functionConsumerAddress}`)
})
