import { HardhatUserConfig } from "hardhat/config";
//import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-toolbox-viem";
import { mnemonicToAccount } from "viem/accounts";



require('dotenv').config()

import * as ethers from 'ethers';
const mnemonic = process.env.ADMIN_PASSPHRASE!!;
const wallet = ethers.Wallet.fromPhrase(mnemonic);
const privateKey = wallet.privateKey;



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
  etherscan: {
    apiKey: {
      snowtrace: "snowtrace", // apiKey is not required, just set a placeholder
    },
    customChains: [
      {
        network: "snowtrace",
        chainId: 43113,
        urls: {
          apiURL: "https://api.routescan.io/v2/network/testnet/evm/43113/etherscan",
          browserURL: "https://testnet.snowtrace.io"
        }
      }
    ]
  },
  networks: {
    snowtrace: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      accounts: [privateKey]
    },
  },
  defaultNetwork: "hardhat"
};

export default config;
