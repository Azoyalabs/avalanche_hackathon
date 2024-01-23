// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@chainlink/contracts-ccip/src/v0.8/shared/access/OwnerIsCreator.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";


import "./MediumAccess.sol";

/*
contract CCIPTokenAndDataReceiver is CCIPReceiver, OwnerIsCreator {
    MediumAccess public nft;
    uint256 price;
    
    event MintCallSuccessfull();
    
    constructor(address router, uint256 _price) CCIPReceiver(router) {
        nft = new MediumAccess();
        price = _price;
    }
    
    function _ccipReceive(
        Client.Any2EVMMessage memory message
    ) 
        internal 
        override 
    {
        require(message.destTokenAmounts[0].amount >= price, "Not enough CCIP-BnM for mint");
        (bool success, ) = address(nft).call(message.data);
        require(success);
        emit MintCallSuccessfull();
    }
}
*/