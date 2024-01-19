// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./PaymentAggregator.sol";

import "./IdTracker.sol";
import "./TokenUtils.sol";

contract MediumAccess is ERC1155, Ownable, PaymentAggregator, IdTracker, TokenUtils {
    uint256 constant MAX_ARTICLE_ID = 1 << (96 - 1);
    
    uint256 public mintPrice;


    constructor(address initialOwner, uint256 _mintPrice)
        ERC1155("") // "https://samplewebsite.org/api/{id}"
        Ownable(initialOwner)
    {
        // price is in wei
        mintPrice = _mintPrice;
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    error AlreadyOwned (address minter, uint tokenId);
    error OnlyMintOne ();
    error InvalidFunds (uint fundsSent, uint fundsRequired);
    error ArticleIdTooBig (uint maxId, uint requestedId);
    error ArticleIdNonSequential (uint invalidArticleId, uint requiredArticleId);

    // use data to provide a signature? nah can leave it open for a PoC tbh
    // use id to route logic
    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public payable {
        if (amount != 1) {
            //revert("Invalid amount to mint");
            revert OnlyMintOne();
        }

        (address creator, uint articleId , bool isPaying) = parseTokenId(id);
        if (articleId >= MAX_ARTICLE_ID) {
            revert ArticleIdTooBig(MAX_ARTICLE_ID, articleId);
        }

        if (creator != msg.sender) {
            if (ERC1155.balanceOf(account, id) > 0) {
                //revert("Already owned");
                revert AlreadyOwned (account, id);
            }

            if (isPaying && msg.value != mintPrice) {
                //revert("Invalid Funds");
                revert InvalidFunds(msg.value, mintPrice);
            } else {
                aggregated[creator] += msg.value;
            }
        } else {            
            // perform checks on id of article 
            if (!isValidId(creator, articleId)) {
                revert ArticleIdNonSequential(
                    articleId,
                    idTracker[creator]
                );
                //revert("Invalid Token Id");
            } else {
                incrementTrackedId(creator);
            }
        }

        _mint(account, id, amount, data);
    }


    // what do i do with mint batch? need safety like normal "mint" method
    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }

}
