// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@chainlink/contracts-ccip/src/v0.8/shared/access/OwnerIsCreator.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";


import "./MediumAccess.sol";

/*
    Have the Summit contract implement CCIPTokenAndDataReceiver 

*/
contract CCIPTokenAndDataReceiver is CCIPReceiver, OwnerIsCreator {
    MediumAccess public target;
    uint256 price;
    
    address public paymentToken;

    event MintCallSuccessfull();
    
    constructor(address router, address _target, address _paymentToken, uint256 _price) CCIPReceiver(router) {
        target = MediumAccess(_target); //new MediumAccess();
        paymentToken = _paymentToken;
        price = _price;
    }
    
    function _ccipReceive(
        Client.Any2EVMMessage memory message
    ) 
        internal 
        override 
    {
        require(message.destTokenAmounts[0].amount >= price, "Not enough CCIP-BnM for mint");
        require(message.destTokenAmounts[0].token == paymentToken, "Invalid Denomination for payment");
        (bool success, ) = address(target).call(message.data);
        require(success);
        emit MintCallSuccessfull();
    }
    
        

}
