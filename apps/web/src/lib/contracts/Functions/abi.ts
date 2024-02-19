export const functionConsumerAbi = [
	{
		type: 'constructor',
		inputs: [
			{ name: 'router', internalType: 'address', type: 'address' },
			{ name: 'summitAddress', internalType: 'address', type: 'address' }
		],
		stateMutability: 'nonpayable'
	},
	{ type: 'error', inputs: [], name: 'EmptyArgs' },
	{ type: 'error', inputs: [], name: 'EmptySecrets' },
	{ type: 'error', inputs: [], name: 'EmptySource' },
	{ type: 'error', inputs: [], name: 'NoInlineSecrets' },
	{ type: 'error', inputs: [], name: 'OnlyRouterCanFulfill' },
	{
		type: 'error',
		inputs: [
			{ name: 'value', internalType: 'uint256', type: 'uint256' },
			{ name: 'length', internalType: 'uint256', type: 'uint256' }
		],
		name: 'StringsInsufficientHexLength'
	},
	{
		type: 'error',
		inputs: [{ name: 'requestId', internalType: 'bytes32', type: 'bytes32' }],
		name: 'UnexpectedRequestID'
	},
	{
		type: 'event',
		anonymous: false,
		inputs: [
			{ name: 'from', internalType: 'address', type: 'address', indexed: true },
			{ name: 'to', internalType: 'address', type: 'address', indexed: true }
		],
		name: 'OwnershipTransferRequested'
	},
	{
		type: 'event',
		anonymous: false,
		inputs: [
			{ name: 'from', internalType: 'address', type: 'address', indexed: true },
			{ name: 'to', internalType: 'address', type: 'address', indexed: true }
		],
		name: 'OwnershipTransferred'
	},
	{
		type: 'event',
		anonymous: false,
		inputs: [{ name: 'id', internalType: 'bytes32', type: 'bytes32', indexed: true }],
		name: 'RequestFulfilled'
	},
	{
		type: 'event',
		anonymous: false,
		inputs: [{ name: 'id', internalType: 'bytes32', type: 'bytes32', indexed: true }],
		name: 'RequestSent'
	},
	{
		type: 'event',
		anonymous: false,
		inputs: [
			{
				name: 'requestId',
				internalType: 'bytes32',
				type: 'bytes32',
				indexed: true
			},
			{
				name: 'response',
				internalType: 'bytes',
				type: 'bytes',
				indexed: false
			},
			{ name: 'err', internalType: 'bytes', type: 'bytes', indexed: false }
		],
		name: 'Response'
	},
	{
		type: 'function',
		inputs: [],
		name: 'acceptOwnership',
		outputs: [],
		stateMutability: 'nonpayable'
	},
	{
		type: 'function',
		inputs: [],
		name: 'currentId',
		outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
		stateMutability: 'view'
	},
	{
		type: 'function',
		inputs: [
			{ name: 'requestId', internalType: 'bytes32', type: 'bytes32' },
			{ name: 'response', internalType: 'bytes', type: 'bytes' },
			{ name: 'err', internalType: 'bytes', type: 'bytes' }
		],
		name: 'handleOracleFulfillment',
		outputs: [],
		stateMutability: 'nonpayable'
	},
	{
		type: 'function',
		inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
		name: 'idToAddress',
		outputs: [{ name: '', internalType: 'address', type: 'address' }],
		stateMutability: 'view'
	},
	{
		type: 'function',
		inputs: [],
		name: 'owner',
		outputs: [{ name: '', internalType: 'address', type: 'address' }],
		stateMutability: 'view'
	},
	{
		type: 'function',
		inputs: [{ name: 'response', internalType: 'bytes', type: 'bytes' }],
		name: 'parseResponse',
		outputs: [
			{ name: '', internalType: 'uint256', type: 'uint256' },
			{ name: '', internalType: 'bool', type: 'bool' }
		],
		stateMutability: 'pure'
	},
	{
		type: 'function',
		inputs: [],
		name: 's_lastError',
		outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
		stateMutability: 'view'
	},
	{
		type: 'function',
		inputs: [],
		name: 's_lastRequestId',
		outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
		stateMutability: 'view'
	},
	{
		type: 'function',
		inputs: [],
		name: 's_lastResponse',
		outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
		stateMutability: 'view'
	},
	{
		type: 'function',
		inputs: [
			{ name: 'source', internalType: 'string', type: 'string' },
			{ name: 'encryptedSecretsUrls', internalType: 'bytes', type: 'bytes' },
			{ name: 'donHostedSecretsSlotID', internalType: 'uint8', type: 'uint8' },
			{
				name: 'donHostedSecretsVersion',
				internalType: 'uint64',
				type: 'uint64'
			},
			{ name: 'args', internalType: 'string[]', type: 'string[]' },
			{ name: 'bytesArgs', internalType: 'bytes[]', type: 'bytes[]' },
			{ name: 'subscriptionId', internalType: 'uint64', type: 'uint64' },
			{ name: 'gasLimit', internalType: 'uint32', type: 'uint32' },
			{ name: 'donID', internalType: 'bytes32', type: 'bytes32' }
		],
		name: 'sendRequest',
		outputs: [{ name: 'requestId', internalType: 'bytes32', type: 'bytes32' }],
		stateMutability: 'nonpayable'
	},
	{
		type: 'function',
		inputs: [
			{ name: 'request', internalType: 'bytes', type: 'bytes' },
			{ name: 'subscriptionId', internalType: 'uint64', type: 'uint64' },
			{ name: 'gasLimit', internalType: 'uint32', type: 'uint32' },
			{ name: 'donID', internalType: 'bytes32', type: 'bytes32' }
		],
		name: 'sendRequestCBOR',
		outputs: [{ name: 'requestId', internalType: 'bytes32', type: 'bytes32' }],
		stateMutability: 'nonpayable'
	},
	{
		type: 'function',
		inputs: [],
		name: 'summitContract',
		outputs: [{ name: '', internalType: 'contract Summit', type: 'address' }],
		stateMutability: 'view'
	},
	{
		type: 'function',
		inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
		name: 'toString',
		outputs: [{ name: '', internalType: 'string', type: 'string' }],
		stateMutability: 'pure'
	},
	{
		type: 'function',
		inputs: [{ name: 'to', internalType: 'address', type: 'address' }],
		name: 'transferOwnership',
		outputs: [],
		stateMutability: 'nonpayable'
	}
] as const;
