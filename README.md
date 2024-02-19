# Summit

## Overview 

Summit is an online publishing platform that enables users to create, share, and discover high-quality articles on diverse subjects. It serves as a medium for writers to express their ideas, experiences, and expertise in long-form content, fostering a community of readers and contributors.

Summit leverages the Avalanche blockchain to bring transparency and openness to the community, addressing a core demand from users of Web2-based social platforms. 

You can interact with Summit [on our dedicated website](https://avalanche-hackathon-web.vercel.app/)

The code for the Summit smart contract and its UI are [available on github](https://github.com/Azoyalabs/avalanche_hackathon). 

The contract is currently live on the Fuji Testnet and verified on the explorer, [you can access it here](https://testnet.snowtrace.io/address/0x3dc7bdf76ed0df86c15978c89ee1ea13c692af88/contract/43113/code?chainId=43113)

Articles are also available as NFTs, tradable on OpenSea and other NFT marketplaces: [OpenSea](https://testnets.opensea.io/fr/assets/avalanche-fuji/0x30cdaa09e7a763ca2521fe6a9710776bd7a746e6/6408127683748287498525528440796427317281100039138196694152555658537814982656)


## Key features

Summit is a complex project that boasts multiple features and enhancements intended to make it user-friendly, easy to interact with and prevent abuse.

- Decentralized and transparent   
By leveraging smart contracts and the Avalanche blockchain, the code of the smart contracts managing the protocol is open for review ensuring there’s no funny business going on behind the scenes. 

- Crosschain payments through Chainlink’s CCIP   
By making use of the CCIP protocol implemented by Chainlink, Summit boasts its own Receiver smart contract that allows for interaction with the protocol from many EVM-based blockchains, such as Ethereum, Arbitrum, Polygon, Base and many others.   

- Social sign-in using Particle Authentication   
While Summit is a Web3 product, it also caters to a wide range of users through the use of the Particle Social Sign-in system. Users can connect using Web2 accounts from popular services, such as Google, or their own email. This Sign-in system is intended to help bring in a wider public by simplifying the registration process and hiding blockchain-related complexities. 

- Bots security implemented with Chainlink functions   
Social platforms face a common challenge of addressing automated content generation and other interactions from non-human accounts. This challenge has only become larger as time went by, with the on-going development of AI models accessible to the public. We use Chainlink functions to power an authorization system tailored to filter bots and nefarious actors.

- Integration with Avvy, the Avalanche Name Service    
Social platforms also mean an opportunity to build a following and identity verification is a part of this process. Summit is integrated with Avvy, the Avalanche Name Service, thereby guaranteeing a single identity on multiple Avalanche-based platforms.



## Testnet

Summit has been deployed on the Fuji Testnet, along with its CCIP Receiver smart contract for cross chain interaction and the Function Consumer to interact with the Chainlink Decentralized Oracle Network (DON).

```
Summit address: 
0x3dc7bdf76ed0df86c15978c89ee1ea13c692af88

Receiver address:  
0x7c74fcc86d7e9b5173cb983f6ca4a7189dfb24d2

Function consumer address: 
0xf7f13365d652b33208a4c952ebb05c38f1044abd

```

We recommend using our dedicated UI to interact with the contract (see Overview).