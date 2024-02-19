import { createWalletClient, createPublicClient, http, toHex } from "viem";

import { avalancheFuji, bscTestnet } from 'viem/chains'
import { mnemonicToAccount } from 'viem/accounts'


// encode offchain instead of setting up intermediary contracts
// https://github.com/smartcontractkit/smart-contract-examples/blob/main/ccip-offchain/javascript/src/transfer-tokens.js


require('dotenv').config()

import { CCIP_TESTNET_CONTRACTS_INFO, DEV_RECEIVER_ADDRESS, SUMMIT_ADDRESS } from "./constants";
const RECEIVER_ADDRESS = DEV_RECEIVER_ADDRESS;
import { stringToAddress } from "./utils";
import { bnMTokenAbi, summitAbi } from "../generated/contractAbis";


import { ccipRouterAbi } from "../generated/contractAbis";

import * as viem from "viem";


async function main() {
    const admin_account = mnemonicToAccount(process.env.ADMIN_PASSPHRASE!);

    const user_account = mnemonicToAccount(process.env.USER_PASSPHRASE!);

    const wallet = createWalletClient(
        {
            account: user_account,
            chain: bscTestnet,
            transport: http(bscTestnet.rpcUrls.public.http[0])
        }
    )


    const publicClient = createPublicClient({
        chain: bscTestnet,
        transport: http(bscTestnet.rpcUrls.public.http[0])
    })

    const functionSelector = "0x97a657c9";

    const encodedData = viem.encodeAbiParameters(
        [
            { name: 'gasLimit', type: 'uint' },
        ],
        [BigInt(500000)]
    );

    const encodedExtraArgs = functionSelector + encodedData.slice(2);

    const tokenAmounts = [
        {
            token: CCIP_TESTNET_CONTRACTS_INFO.bnb.tokens["CCIP-BnM"] as `0x{string}`,
            amount: BigInt(100),
        },
    ];

    const dataEncoded = viem.encodeAbiParameters(
        [
            { name: 'tokenId', type: 'uint256' },
        ],
        [BigInt("6408127683748287498525528440796427317281100039138196694152555658537814982657")]
    );

    const receiver = viem.encodeAbiParameters(
        [
            { name: 'receiver', type: 'address' }
        ],
        [RECEIVER_ADDRESS]
    );

    const message = {
        receiver: receiver,
        data: dataEncoded, // no data
        tokenAmounts: tokenAmounts,
        feeToken: viem.zeroAddress, // If fee token address is provided then fees must be paid in fee token.
        extraArgs: encodedExtraArgs,
    };


    const chainSelector = CCIP_TESTNET_CONTRACTS_INFO.fuji.chain_selector;


    let bnmContract = viem.getContract({
        abi: bnMTokenAbi,
        address: CCIP_TESTNET_CONTRACTS_INFO.bnb.tokens["CCIP-BnM"] as `0x{string}`,
        walletClient: wallet
        //publicClient: publicClient
    })

    let txApproval = await bnmContract.write.approve(
        [CCIP_TESTNET_CONTRACTS_INFO.bnb.router as `0x{string}`, BigInt(10000)]
    );


    // get router contract
    let routerContract = viem.getContract({
        abi: ccipRouterAbi,
        address: CCIP_TESTNET_CONTRACTS_INFO.bnb.router as `0x{string}`,
        walletClient: wallet,
        publicClient: publicClient
    }
    );


    const fees = await routerContract.read.getFee(
            [chainSelector, message]
        );


    let tx = await routerContract.write.ccipSend(
        [chainSelector,
            message
        ],
        {
            value: fees,
            gas: BigInt(500000)
        }
    );

    return tx;
}


main().then((res) => {
    console.log(`Sent crosschain mint. Tx hash: ${res}`)
})