// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

enum AccessStatus {
    Unknown,
    Authorized,
    Banned
}

contract AccessControl {
    address public controlAdmin;
    mapping(address => AccessStatus) public accessStatusTracker;

    error NotAllowedAccess(address user);

    constructor(address _controlAdmin) {
        controlAdmin = _controlAdmin;
    }

    function setStatus(address user, AccessStatus newStatus) internal {
        accessStatusTracker[user] = newStatus;
    }

    function _setAccessControlAdmin(address newAdmin) internal {
        controlAdmin = newAdmin;
    }
}
