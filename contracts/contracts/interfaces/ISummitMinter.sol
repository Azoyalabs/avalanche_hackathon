// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ISummitMinter {
    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) external;
}
