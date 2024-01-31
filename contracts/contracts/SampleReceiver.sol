// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {IERC677Receiver} from "@chainlink/contracts-ccip/src/v0.8/shared/token/ERC677/IERC677Receiver.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";

contract MyReceiver is CCIPReceiver, IERC677Receiver {
    string public methodCalled;
    string public recordedMessage;

    constructor(address router) CCIPReceiver(router) {}

    function _ccipReceive(Client.Any2EVMMessage memory message)
        internal
        override
    {
        methodCalled = "_ccipReceive";
        recordedMessage = abi.decode(message.data, (string));
    }

    function onTokenTransfer(
        address sender,
        uint256 amount,
        bytes calldata data
    ) external {
        methodCalled = "onTokenTransfer";
        recordedMessage = abi.decode(data, (string));
    }

    function strToBytes(string calldata data) public pure returns (bytes memory) {
        return abi.encode(data);

    }
}
