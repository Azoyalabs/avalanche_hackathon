//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BnMToken
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const bnMTokenAbi = [
  {
    type: 'error',
    inputs: [
      { name: 'supplyAfterMint', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'MaxSupplyExceeded',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'SenderNotBurner',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'SenderNotMinter',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'burner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BurnAccessGranted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'burner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BurnAccessRevoked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'minter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'MintAccessGranted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'minter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'MintAccessRevoked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferRequested',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'Transfer',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'acceptOwnership',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'burn',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'burn',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'burnFrom',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'subtractedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'decreaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'subtractedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'decreaseApproval',
    outputs: [{ name: 'success', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getBurners',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getMinters',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'burner', internalType: 'address', type: 'address' }],
    name: 'grantBurnRole',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'burnAndMinter', internalType: 'address', type: 'address' },
    ],
    name: 'grantMintAndBurnRoles',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'minter', internalType: 'address', type: 'address' }],
    name: 'grantMintRole',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'addedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'addedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseApproval',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'burner', internalType: 'address', type: 'address' }],
    name: 'isBurner',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'minter', internalType: 'address', type: 'address' }],
    name: 'isMinter',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'maxSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'burner', internalType: 'address', type: 'address' }],
    name: 'revokeBurnRole',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'minter', internalType: 'address', type: 'address' }],
    name: 'revokeMintRole',
    outputs: [],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'transferAndCall',
    outputs: [{ name: 'success', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'to', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Summit
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const summitAbi = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: 'initialOwner', internalType: 'address', type: 'address' },
      { name: 'accessController', internalType: 'address', type: 'address' },
      { name: '_tokenReceiver', internalType: 'address', type: 'address' },
      { name: '_mintPrice', internalType: 'uint256', type: 'uint256' },
      { name: 'uri_', internalType: 'string', type: 'string' },
    ],
  },
  {
    type: 'error',
    inputs: [
      { name: 'minter', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'AlreadyOwned',
  },
  {
    type: 'error',
    inputs: [
      { name: 'invalidArticleId', internalType: 'uint256', type: 'uint256' },
      { name: 'requiredArticleId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ArticleIdNonSequential',
  },
  {
    type: 'error',
    inputs: [
      { name: 'requested', internalType: 'uint256', type: 'uint256' },
      { name: 'maxAvailable', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ArticleIdNotExist',
  },
  {
    type: 'error',
    inputs: [
      { name: 'maxId', internalType: 'uint256', type: 'uint256' },
      { name: 'requestedId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ArticleIdTooBig',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC1155InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidApprover',
  },
  {
    type: 'error',
    inputs: [
      { name: 'idsLength', internalType: 'uint256', type: 'uint256' },
      { name: 'valuesLength', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC1155InvalidArrayLength',
  },
  {
    type: 'error',
    inputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidOperator',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidSender',
  },
  {
    type: 'error',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'ERC1155MissingApprovalForAll',
  },
  {
    type: 'error',
    inputs: [
      { name: 'fundsSent', internalType: 'uint256', type: 'uint256' },
      { name: 'fundsRequired', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InvalidFunds',
  },
  { type: 'error', inputs: [], name: 'Never' },
  {
    type: 'error',
    inputs: [{ name: 'author', internalType: 'address', type: 'address' }],
    name: 'NoArticlesByAuthor',
  },
  {
    type: 'error',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'NotAllowedAccess',
  },
  { type: 'error', inputs: [], name: 'OnlyMintOne' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'error',
    inputs: [
      { name: 'requestedTokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'TokenIdNotExist',
  },
  { type: 'error', inputs: [], name: 'Unauthorized' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'ids',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'values',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'TransferBatch',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TransferSingle',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'value', internalType: 'string', type: 'string', indexed: false },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'URI',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'accessStatusTracker',
    outputs: [{ name: '', internalType: 'enum AccessStatus', type: 'uint8' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'aggregated',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'accounts', internalType: 'address[]', type: 'address[]' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'balanceOfBatch',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'controlAdmin',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [
      { name: 'creator', internalType: 'address', type: 'address' },
      { name: 'articleId', internalType: 'uint256', type: 'uint256' },
      { name: 'isPaying', internalType: 'bool', type: 'bool' },
    ],
    name: 'createTokenId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'findAlternateId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'idTracker',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'minter', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'paymentAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'mintErc20',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'mintPrice',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'parseTokenId',
    outputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bool', type: 'bool' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeBatchTransferFrom',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newAdmin', internalType: 'address', type: 'address' }],
    name: 'setAccessControlAdmin',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'newStatus', internalType: 'enum AccessStatus', type: 'uint8' },
    ],
    name: 'setAccessStatus',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newuri', internalType: 'string', type: 'string' }],
    name: 'setURI',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'tokenReceiver',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'tokensTracker',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'newMintPrice', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'updateMintPrice',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'uri',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'withdraw',
    outputs: [],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SummitReceiver
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const summitReceiverAbi = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: 'router', internalType: 'address', type: 'address' },
      { name: '_target', internalType: 'address', type: 'address' },
      { name: '_paymentToken', internalType: 'address', type: 'address' },
    ],
  },
  {
    type: 'error',
    inputs: [{ name: 'router', internalType: 'address', type: 'address' }],
    name: 'InvalidRouter',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'MintCallSuccessfull' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferRequested',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'acceptOwnership',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'message',
        internalType: 'struct Client.Any2EVMMessage',
        type: 'tuple',
        components: [
          { name: 'messageId', internalType: 'bytes32', type: 'bytes32' },
          {
            name: 'sourceChainSelector',
            internalType: 'uint64',
            type: 'uint64',
          },
          { name: 'sender', internalType: 'bytes', type: 'bytes' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
          {
            name: 'destTokenAmounts',
            internalType: 'struct Client.EVMTokenAmount[]',
            type: 'tuple[]',
            components: [
              { name: 'token', internalType: 'address', type: 'address' },
              { name: 'amount', internalType: 'uint256', type: 'uint256' },
            ],
          },
        ],
      },
    ],
    name: 'ccipReceive',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getRouter',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onTokenTransfer',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'paymentToken',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'target',
    outputs: [{ name: '', internalType: 'contract Summit', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'to', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'beneficiary', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferTokens',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_newTarget', internalType: 'address', type: 'address' }],
    name: 'updateTarget',
    outputs: [],
  },
] as const
