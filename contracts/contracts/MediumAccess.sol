// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./PaymentAggregator.sol";

contract MediumAccess is ERC1155, Ownable, PaymentAggregator {
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

    // use data to provide a signature? nah can leave it open for a PoC tbh
    // use id to route logic
    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public payable {
        if (ERC1155.balanceOf(account, id) > 0) {
            //revert("Already owned");
            revert AlreadyOwned (account, id);
        }

        if (amount != 1) {
            //revert("Invalid amount to mint");
            revert OnlyMintOne();
        }

        (address creator, , bool isPaying) = parseTokenId(id);

        if (creator != msg.sender) {
            if (isPaying && msg.value != mintPrice) {
                //revert("Invalid Funds");
                revert InvalidFunds(msg.value, mintPrice);
            } else {
                aggregated[creator] += msg.value;
            }
        } else {
            // restrict creator to only mint to itself? 
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

    uint256 constant MAX_ARTICLE_ID = 1 << (96 - 1);

    function createTokenId(
        address creator,
        uint256 articleId,
        bool isPaying
    ) public pure returns (uint256) {
        if (articleId >= MAX_ARTICLE_ID) {
            revert ArticleIdTooBig(MAX_ARTICLE_ID, articleId);
        }
        //require(articleId <= MAX_ARTICLE_ID, "Article ID too large");

        uint256 tokenId = (uint256(uint160(creator)) << 96) + (articleId << 1);
        if (isPaying) {
            tokenId += 1;
        }

        return tokenId;
    }

    // from a token id, returns the creator, the article number for this creator and whether is a paying article or not
    function parseTokenId(uint256 tokenId)
        public
        pure
        returns (
            address,
            uint256,
            bool
        )
    {
        return (
            address(uint160(tokenId >> 96)),
            uint96(tokenId) >> 1,
            (tokenId << 255) >> 255 == 1
        );
    }
}
