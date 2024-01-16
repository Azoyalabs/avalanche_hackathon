# Contracts

Store all smart contracts here


## Payment Aggregator  

Tracks earnings of article creators through a mapping and dedicated withdraw function (pull pattern to avoid issues).  


## MediumAccess   

ERC-1155 based contract handling minting of NFTs for article access 

Extended by PaymentAggregator.  

Notes: Need to add ERC1155 supply, to keep track in contract of whether a given id already exists? 
https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.5/contracts/token/ERC1155/extensions/ERC1155Supply.sol 

