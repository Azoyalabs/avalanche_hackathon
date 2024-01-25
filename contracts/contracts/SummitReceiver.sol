// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@chainlink/contracts-ccip/src/v0.8/shared/access/OwnerIsCreator.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {IERC677Receiver} from "@chainlink/contracts-ccip/src/v0.8/shared/token/ERC677/IERC677Receiver.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

//import "./MediumAccess.sol";
import "./Summit.sol";

/*
    Entrypoint for payments to Summit. 
    We'll use this simply as a relayer, and leave the checks to the Summit contract
*/
contract SummitReceiver is CCIPReceiver, OwnerIsCreator, IERC677Receiver {
    Summit public target;

    address public paymentToken;

    event MintCallSuccessfull();

    constructor(
        address router,
        address _target,
        address _paymentToken
    ) CCIPReceiver(router) {
        target = Summit(_target); //new MediumAccess();
        paymentToken = _paymentToken;
    }

    /*
    function _ccipReceive(
        Client.Any2EVMMessage memory message
    ) internal override {
        require(
            message.destTokenAmounts[0].amount >= price,
            "Not enough CCIP-BnM for mint"
        );
        require(
            message.destTokenAmounts[0].token == paymentToken,
            "Invalid Denomination for payment"
        );
        (bool success, ) = address(target).call(message.data);
        require(success);
        emit MintCallSuccessfull();
    }
    */

    function updateTarget(address _newTarget) external {
        target = Summit(_newTarget);
    }

    function _ccipReceive(
        Client.Any2EVMMessage memory message
    ) internal override {
        require(
            message.destTokenAmounts[0].token == paymentToken,
            "Invalid Denomination for payment"
        );
        //(bool success, ) = address(target).call(message.data);

        // call data should contain the tokenId to mint
        target.mintErc20(
            abi.decode(message.sender, (address)), // sender address
            abi.decode(message.data, (uint256)), // tokenId
            message.destTokenAmounts[0].amount,
            new bytes(0)
        );
        emit MintCallSuccessfull();
    }

    /**
     * Handle direct mint in a same chain context, unlike ccipReceive which handles crosschain minting
     * Payment done through ERC20 so need to have given allowance to this contract
     */
    function directPayment(
        uint256 tokenId,
        uint256 paymentAmount,
        bytes memory data
    ) public {
        // need to handle payment here if amount is non-zero
        if (paymentAmount > 0) {
            IERC20(paymentToken).transferFrom(
                msg.sender,
                address(this),
                paymentAmount
            );
        }

        target.mintErc20(msg.sender, tokenId, paymentAmount, data);
    }

    /*
        Also could implement as a callback from the ERC20 instead of approval + transfer right? 
        CCIP-BnM is an ERC677 token, which is a transferAndCall token
        See on Sepolia: https://sepolia.etherscan.io/address/0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05#writeContract

        transfer and call has the following signature:
        function transferAndCall(address to, uint amount, bytes memory data) public returns (bool success) {
        and "to" is the one called 

        would be good to import IERC-677? 
    */
    function onTokenTransfer(
        address sender,
        uint256 amount,
        bytes calldata data
    ) external {
        require(msg.sender != paymentToken, "Unauthorized");

        target.mintErc20(
            sender,
            abi.decode(data, (uint256)),
            amount,
            new bytes(0)
        );
    }
}
