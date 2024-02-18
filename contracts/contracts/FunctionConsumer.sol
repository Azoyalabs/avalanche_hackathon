// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";

import "@openzeppelin/contracts/utils/Strings.sol";
import "./Summit.sol";
import "./AccessControl.sol";

// Modified Function consumer to track ids
contract FunctionConsumer is FunctionsClient, ConfirmedOwner {
    using FunctionsRequest for FunctionsRequest.Request;

    bytes32 public s_lastRequestId;
    bytes public s_lastResponse;
    bytes public s_lastError;

    uint256 public currentId;
    Summit public summitContract;

    mapping(uint => address) public idToAddress;

    error UnexpectedRequestID(bytes32 requestId);

    event Response(bytes32 indexed requestId, bytes response, bytes err);

    constructor(
        address router,
        address summitAddress
    ) FunctionsClient(router) ConfirmedOwner(msg.sender) {
        summitContract = Summit(summitAddress);
    }

    function toString(address account) public pure returns (string memory) {
        //return toString(abi.encodePacked(account));
        return Strings.toHexString(uint256(uint160(account)), 20);
        /*
        address addr;
        assembly {
            addr := mload(add(bys, 20))
        }

        return 
        */
    }

    /**
     * @notice Send a simple request
     * @param source JavaScript source code
     * @param encryptedSecretsUrls Encrypted URLs where to fetch user secrets
     * @param donHostedSecretsSlotID Don hosted secrets slotId
     * @param donHostedSecretsVersion Don hosted secrets version
     * @param args List of arguments accessible from within the source code
     * @param bytesArgs Array of bytes arguments, represented as hex strings
     * @param subscriptionId Billing ID
     */
    function sendRequest(
        string memory source,
        bytes memory encryptedSecretsUrls,
        uint8 donHostedSecretsSlotID,
        uint64 donHostedSecretsVersion,
        string[] memory args,
        bytes[] memory bytesArgs,
        uint64 subscriptionId,
        uint32 gasLimit,
        bytes32 donID
    ) external returns (bytes32 requestId) {
        string[] memory _args = new string[](2);
        _args[0] = toString(msg.sender);
        _args[1] = Strings.toString(currentId);
        
        idToAddress[currentId] = msg.sender;
        currentId += 1;

        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source);
        if (encryptedSecretsUrls.length > 0)
            req.addSecretsReference(encryptedSecretsUrls);
        else if (donHostedSecretsVersion > 0) {
            req.addDONHostedSecrets(
                donHostedSecretsSlotID,
                donHostedSecretsVersion
            );
        }
        req.setArgs(_args);
        if (bytesArgs.length > 0) req.setBytesArgs(bytesArgs);
        s_lastRequestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donID
        );
        return s_lastRequestId;
    }

    /**
     * @notice Send a pre-encoded CBOR request
     * @param request CBOR-encoded request data
     * @param subscriptionId Billing ID
     * @param gasLimit The maximum amount of gas the request can consume
     * @param donID ID of the job to be invoked
     * @return requestId The ID of the sent request
     */
    function sendRequestCBOR(
        bytes memory request,
        uint64 subscriptionId,
        uint32 gasLimit,
        bytes32 donID
    ) external onlyOwner returns (bytes32 requestId) {
        s_lastRequestId = _sendRequest(
            request,
            subscriptionId,
            gasLimit,
            donID
        );
        return s_lastRequestId;
    }

    /**
     * @notice Store latest result/error
     * @param requestId The request ID, returned by sendRequest()
     * @param response Aggregated response from the user code
     * @param err Aggregated error from the user code or from the execution pipeline
     * Either response or error parameter will be set, but never both
     */
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (s_lastRequestId != requestId) {
            revert UnexpectedRequestID(requestId);
        }
        s_lastResponse = response;
        s_lastError = err;
        emit Response(requestId, s_lastResponse, s_lastError);

        if (err.length == 0) {
            processResponse(response);
        } 
        
        /*
        else {
            revert("Chainlink Oracle returned an error");
        }
        */
    }

    function processResponse(bytes memory response) internal {
        (uint requestId, bool isNotBot) = parseResponse(response);
        address requester = idToAddress[requestId];

        summitContract.setAccessStatus(
            requester,
            isNotBot ? AccessStatus.Authorized : AccessStatus.Banned
        );
    }

    function parseResponse(
        bytes memory response
    ) public pure returns (uint, bool) {
        uint resValue = abi.decode(response, (uint256));

        uint requestId = resValue >> 1;
        bool flagValue = ((resValue << 255) >> 255) == 1;

        return (requestId, flagValue);
    }
}
