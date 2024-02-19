import { createWalletClient, createPublicClient, http, toHex } from "viem";

import { avalancheFuji } from 'viem/chains'
import { mnemonicToAccount } from 'viem/accounts'

import * as fs from 'node:fs';

/*
const {
    SubscriptionManager,
    SecretsManager,
    simulateScript,
    ResponseListener,
    buildRequestCBOR,
    ReturnType,
    decodeResult,
    Location,
    CodeLanguage,
    FulfillmentCode,
} = require("@chainlink/functions-toolkit");
*/

require('dotenv').config()

import { stringToAddress } from "./utils";
import { functionConsumerAbi } from "../generated/contractAbis";

import * as viem from "viem";
import * as ethers from "ethers";

//import {FUNCTION_CONSUMER} from "./constants";
import {DEV_FUNCTION_CONSUMER} from "./constants";
const FUNCTION_CONSUMER = DEV_FUNCTION_CONSUMER;

//const FUNCTION_CONSUMER = "0x921F0F46Dc220d577377EE97e2bB2b9b7e60BA53" as `0x{string}`;


async function main() {
    const admin_account = mnemonicToAccount(process.env.ADMIN_PASSPHRASE!!, {
        //changeIndex: 1
    })

    const user_account = mnemonicToAccount(process.env.USER_PASSPHRASE!!, {
        //changeIndex: 1
    })


    const wallet = createWalletClient(
        {
            account: admin_account,
            chain: avalancheFuji,
            transport: http(avalancheFuji.rpcUrls.public.http[0])
        }
    )


    const publicClient = createPublicClient({
        chain: avalancheFuji,
        transport: http(avalancheFuji.rpcUrls.public.http[0])
    })

    let functionReceiverContract = viem.getContract({
        abi: functionConsumerAbi, //SUMMIT_ABI, //SUMMIT_DATA.abi,
        address: FUNCTION_CONSUMER, //"0xc6A85Dfd7c1C696e5cD4959Eb0B2189B7ff839ed", //FUNCTION_CONSUMER,
        walletClient: wallet,
        publicClient: publicClient
    })

    // read source 
    const source = fs.readFileSync("./scripts/qsc.js").toString();
    //console.log(source)    

    /*
    let response = simulateScript({
        source: source,
        args: [admin_account.address.toString()],
    }
    )

    console.log("Simulation result", response);
    const errorString = response.errorString;
    if (errorString) {
      console.log(`❌ Error during simulation: `, errorString);
    } else {
      const returnType = ReturnType.uint256;
      const responseBytesHexstring = response.responseBytesHexstring;
      if (ethers.toBeArray(responseBytesHexstring).length > 0) {
        const decodedResponse = decodeResult(
          response.responseBytesHexstring,
          returnType
        );
        console.log(`✅ Decoded response to ${returnType}: `, decodedResponse);
      }
    }

    exit()
    */

    let res = await functionReceiverContract.write.sendRequest(
        [
            source,
            "0x",
            0,
            BigInt(0), //BigInt(0),
            [],//[admin_account.address.toString(), "10"],
            [],
            BigInt(4179), //BigInt(4179),
            300000,
            "0x66756e2d6176616c616e6368652d66756a692d31000000000000000000000000"
            //ethers.encodeBytes32String("fun-avalanche-fuji-1") as `0x{string}`
        ],
        {
            account: admin_account,
            gas: BigInt(500000),
        }
    );

    console.log(`sender address: ${admin_account.address}`)

    return res
}


main().then((res) => {
    console.log(`Tx sent. Tx hash: ${res}`)
})