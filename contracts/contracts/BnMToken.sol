// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC677} from "@chainlink/contracts-ccip/src/v0.8/shared/token/ERC677/ERC677.sol";


contract BnMToken is ERC677 {
    constructor() ERC677("CCIP-BnM", "CCIP-BnM") {}
}
