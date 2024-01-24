// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IMintable {
    function mint(address account, uint256 id, uint256 amount) external;
    

}
