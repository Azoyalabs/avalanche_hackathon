import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

import '@nomicfoundation/hardhat-toolbox';
import "@nomicfoundation/hardhat-chai-matchers";
import '@openzeppelin/hardhat-upgrades';


const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.22",
    settings: {
      evmVersion: "paris"
    }
  },
  paths: {
    sources: "./contracts"
  }
  
};

export default config;
