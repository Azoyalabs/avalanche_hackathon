# Contracts

Store all smart contracts here


## Overview  

Payment is to be done in CCIP tokens (CCIP-BnM) so the setup is complex, both for smart contract and testing.   

MediumAccess is the "meat" of our projects: it's a modified ERC-1155 that handles minting of tokens representing access to articles   
As mentionned, payment is done in CCIP tokens and should allow cross-chain payments.   
This means that we require an additional contract that implements "CCIPReceiver" and which will call MediumAccess  
CCIPReceiver in turn requires a "router" which is what handles OnRamp and OffRamp between crosschain calls 



## General Remarks   

Does the CCIP router allow same chain messaging? And how is this handled?  
Issue here is with testing: if testing requires offchain processing, then can't use set up with router for same chain testing? 
Nah it's fine? I can just call the offramp myself? Need to check how offramp is handled though, may require signatures I suppose  


The beneficiary of token transfers is CCIPReceiver. How can users withdraw their funds? Do I forward funds to MediumAccess, do I handle this logic in the CCIPReceiver or do I set up a seperate contract (Bank)? Tbh better to just merge CCIPReceiver with base contract.
But then issues with inheritance, bit of a pain tbh   



## Payment Aggregator  

Tracks earnings of article creators through a mapping and dedicated withdraw function (pull pattern to avoid issues).  


## MediumAccess   

ERC-1155 based contract handling minting of NFTs for article access 

Extended by PaymentAggregator.  

Notes: Need to add ERC1155 supply, to keep track in contract of whether a given id already exists? 
https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.5/contracts/token/ERC1155/extensions/ERC1155Supply.sol 

