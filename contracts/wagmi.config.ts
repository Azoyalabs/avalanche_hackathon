import { defineConfig } from '@wagmi/cli'

import * as SUMMIT_DATA from "./artifacts/contracts/Summit.sol/Summit.json";
import * as SUMMIT_RECEIVER_DATA from "./artifacts/contracts/SummitReceiver.sol/SummitReceiver.json";
import * as BNM_TOKEN_DATA from "./artifacts/contracts/BnMToken.sol/BnMToken.json";
import { Abi } from 'viem';


export default defineConfig({
  out: 'generated/contractAbis.ts',
  contracts: [
    { name: 'Summit', abi: SUMMIT_DATA.abi as Abi }, 
    { name: 'SummitReceiver', abi: SUMMIT_RECEIVER_DATA.abi as Abi },
    { name: 'BnMToken', abi: BNM_TOKEN_DATA.abi as Abi }

  ],
  plugins: [],
});