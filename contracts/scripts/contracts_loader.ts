import * as summitData from "../artifacts/contracts/Summit.sol/Summit.json";
import * as summitreceiver from "../artifacts/contracts/SummitReceiver.sol/SummitReceiver.json";

import { Abi } from 'viem';

export const SUMMIT_ABI: Abi = summitData.abi as Abi;

export const SUMMIT_DATA = summitData;
export const SUMMIT_RECEIVER_DATA = summitreceiver;

