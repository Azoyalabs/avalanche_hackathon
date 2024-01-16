// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PaymentAggregator {
    mapping(address => uint) public aggregated;

    function withdraw() public {
        uint amount = aggregated[msg.sender];

        if (amount == 0) {
            revert("No funds to withdraw");
        } else {
            aggregated[msg.sender] = 0;
            require(payable(msg.sender).send(amount), "Transfer failed");
        }
    }
}