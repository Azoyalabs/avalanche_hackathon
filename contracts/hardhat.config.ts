import { HardhatUserConfig } from "hardhat/config";
//import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-toolbox-viem";

//import '@nomicfoundation/hardhat-toolbox';
//import '@openzeppelin/hardhat-upgrades';


const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.22",
        settings: {
          evmVersion: "paris"
        }
      },
      {
        version: "0.8.19",
        settings: {
          evmVersion: "paris"
        }
      }

    ]
  },
  paths: {
    sources: "./contracts"
  },
  defaultNetwork: "hardhat"
};

export default config;
