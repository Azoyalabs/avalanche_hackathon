// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// import "@openzeppelin/contracts/utils/Strings.sol";


// import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
// import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
// import "@chainlink/contracts-ccip/src/v0.8/shared/access/OwnerIsCreator.sol";

import "./PaymentAggregator.sol";
import "./AccessControl.sol";

import "./IdTracker.sol";
import "./TokenUtils.sol";

contract Summit is ERC1155, Ownable, PaymentAggregator, IdTracker, TokenUtils, AccessControl {
    uint256 constant MAX_ARTICLE_ID = 1 << (96 - 1);

    uint256 public mintPrice;
    address public tokenReceiver;

    mapping(uint => bool) public tokensTracker;

    constructor(
        address initialOwner,
        address accessController,
        address _tokenReceiver,
        uint256 _mintPrice,
        string memory uri_
    )
        ERC1155(uri_) // "https://samplewebsite.org/api/{id}"
        Ownable(initialOwner)
        AccessControl(accessController)
    {
        tokenReceiver = _tokenReceiver;

        // price is in wei
        mintPrice = _mintPrice;
    }

    /*
    string private _uri;

    function uri(uint256 id) override public view returns (string memory) {
        string memory stringId = string(abi.encode(id));
        return string(abi.encodePacked(_uri, stringId));
    }
    */

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    error Unauthorized();
    error Never();

    error AlreadyOwned(address minter, uint tokenId);
    error OnlyMintOne();
    error InvalidFunds(uint fundsSent, uint fundsRequired);
    error ArticleIdTooBig(uint maxId, uint requestedId);
    error ArticleIdNonSequential(uint invalidArticleId, uint requiredArticleId);

    error TokenIdNotExist(uint requestedTokenId);
    error ArticleIdNotExist(uint requested, uint maxAvailable);
    error NoArticlesByAuthor(address author);

    /*
        No need for amount, only minting one by one tbh
        Also restrict to mint to self 

    */
    function mintErc20(
        address minter,
        uint256 tokenId,
        uint256 paymentAmount,
        bytes calldata data
    ) external {
        // only the CCIP receiver can call this
        if (msg.sender != tokenReceiver) {
            revert Unauthorized();
        }

        if (accessStatusTracker[minter] != AccessStatus.Authorized) {
            revert NotAllowedAccess(minter);
        }

        (address creator, uint articleId, bool isPaying) = parseTokenId(
            tokenId
        );

        // need IERC1155-supply here, to check if it's a preexisting article?
        // definitely can simplify tracking

        // first branch: minter is a match with creator
        if (creator == minter) {
            // check if this is a valid ID to mint, aka is it a new article?
            if (!isValidId(creator, articleId)) {
                revert ArticleIdNonSequential(articleId, idTracker[creator]);
            }

            // it's valid, mint to author
            incrementTrackedId(creator);
            tokensTracker[tokenId] = true;
            _mint(minter, tokenId, 1, new bytes(0));
        } else {
            // a common user is minting a token for an article
            // check if the article actually exists
            if (idTracker[creator] == 0) {
                revert NoArticlesByAuthor(creator);
            }

            if (articleId >= idTracker[creator]) {
                revert ArticleIdNotExist(articleId, idTracker[creator] - 1);
            }

            // need to check if is minting the right isPaying type of article
            // can just check balance of author? really need to go through ERC-1155 supply
            if (tokensTracker[tokenId] == false) {
                revert TokenIdNotExist(tokenId);
            }

            // if it's an article with paid access
            if (isPaying) {
                if (paymentAmount != mintPrice) {
                    revert InvalidFunds(paymentAmount, mintPrice);
                } else {
                    // payment is a-ok, can mint
                }

                aggregated[creator] += paymentAmount;
                _mint(minter, tokenId, 1, new bytes(0));
            } else {
                // free article, the user is supporting the author here
                aggregated[creator] += paymentAmount;
                _mint(minter, tokenId, 1, new bytes(0));
            }
        }
    }

    function withdraw() public {
        uint256 amount = aggregated[msg.sender];

        if (amount == 0) {
            revert("No funds to withdraw");
        } else {
            _withdraw(msg.sender, amount, tokenReceiver);
        }
    }

    // what do i do with mint batch? need safety like normal "mint" method
    // just remove it I guess
    /*
    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }
    */
}
