export const ccipRouterAbi = [
	{
		type: 'constructor',
		inputs: [
			{ name: 'wrappedNative', internalType: 'address', type: 'address' },
			{ name: 'armProxy', internalType: 'address', type: 'address' }
		],
		stateMutability: 'nonpayable'
	},
	{ type: 'error', inputs: [], name: 'BadARMSignal' },
	{ type: 'error', inputs: [], name: 'FailedToSendValue' },
	{ type: 'error', inputs: [], name: 'InsufficientFeeTokenAmount' },
	{ type: 'error', inputs: [], name: 'InvalidMsgValue' },
	{
		type: 'error',
		inputs: [{ name: 'to', internalType: 'address', type: 'address' }],
		name: 'InvalidRecipientAddress'
	},
	{
		type: 'error',
		inputs: [
			{ name: 'chainSelector', internalType: 'uint64', type: 'uint64' },
			{ name: 'offRamp', internalType: 'address', type: 'address' }
		],
		name: 'OffRampMismatch'
	},
	{ type: 'error', inputs: [], name: 'OnlyOffRamp' },
	{
		type: 'error',
		inputs: [{ name: 'destChainSelector', internalType: 'uint64', type: 'uint64' }],
		name: 'UnsupportedDestinationChain'
	},
	{
		type: 'event',
		anonymous: false,
		inputs: [
			{
				name: 'messageId',
				internalType: 'bytes32',
				type: 'bytes32',
				indexed: false
			},
			{
				name: 'sourceChainSelector',
				internalType: 'uint64',
				type: 'uint64',
				indexed: false
			},
			{
				name: 'offRamp',
				internalType: 'address',
				type: 'address',
				indexed: false
			},
			{
				name: 'calldataHash',
				internalType: 'bytes32',
				type: 'bytes32',
				indexed: false
			}
		],
		name: 'MessageExecuted'
	},
	{
		type: 'event',
		anonymous: false,
		inputs: [
			{
				name: 'sourceChainSelector',
				internalType: 'uint64',
				type: 'uint64',
				indexed: true
			},
			{
				name: 'offRamp',
				internalType: 'address',
				type: 'address',
				indexed: false
			}
		],
		name: 'OffRampAdded'
	},
	{
		type: 'event',
		anonymous: false,
		inputs: [
			{
				name: 'sourceChainSelector',
				internalType: 'uint64',
				type: 'uint64',
				indexed: true
			},
			{
				name: 'offRamp',
				internalType: 'address',
				type: 'address',
				indexed: false
			}
		],
		name: 'OffRampRemoved'
	},
	{
		type: 'event',
		anonymous: false,
		inputs: [
			{
				name: 'destChainSelector',
				internalType: 'uint64',
				type: 'uint64',
				indexed: true
			},
			{
				name: 'onRamp',
				internalType: 'address',
				type: 'address',
				indexed: false
			}
		],
		name: 'OnRampSet'
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
		type: 'function',
		inputs: [],
		name: 'MAX_RET_BYTES',
		outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
		stateMutability: 'view'
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
		inputs: [
			{
				name: 'onRampUpdates',
				internalType: 'struct Router.OnRamp[]',
				type: 'tuple[]',
				components: [
					{ name: 'destChainSelector', internalType: 'uint64', type: 'uint64' },
					{ name: 'onRamp', internalType: 'address', type: 'address' }
				]
			},
			{
				name: 'offRampRemoves',
				internalType: 'struct Router.OffRamp[]',
				type: 'tuple[]',
				components: [
					{
						name: 'sourceChainSelector',
						internalType: 'uint64',
						type: 'uint64'
					},
					{ name: 'offRamp', internalType: 'address', type: 'address' }
				]
			},
			{
				name: 'offRampAdds',
				internalType: 'struct Router.OffRamp[]',
				type: 'tuple[]',
				components: [
					{
						name: 'sourceChainSelector',
						internalType: 'uint64',
						type: 'uint64'
					},
					{ name: 'offRamp', internalType: 'address', type: 'address' }
				]
			}
		],
		name: 'applyRampUpdates',
		outputs: [],
		stateMutability: 'nonpayable'
	},
	{
		type: 'function',
		inputs: [
			{
				name: 'destinationChainSelector',
				internalType: 'uint64',
				type: 'uint64'
			},
			{
				name: 'message',
				internalType: 'struct Client.EVM2AnyMessage',
				type: 'tuple',
				components: [
					{ name: 'receiver', internalType: 'bytes', type: 'bytes' },
					{ name: 'data', internalType: 'bytes', type: 'bytes' },
					{
						name: 'tokenAmounts',
						internalType: 'struct Client.EVMTokenAmount[]',
						type: 'tuple[]',
						components: [
							{ name: 'token', internalType: 'address', type: 'address' },
							{ name: 'amount', internalType: 'uint256', type: 'uint256' }
						]
					},
					{ name: 'feeToken', internalType: 'address', type: 'address' },
					{ name: 'extraArgs', internalType: 'bytes', type: 'bytes' }
				]
			}
		],
		name: 'ccipSend',
		outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
		stateMutability: 'payable'
	},
	{
		type: 'function',
		inputs: [],
		name: 'getArmProxy',
		outputs: [{ name: '', internalType: 'address', type: 'address' }],
		stateMutability: 'view'
	},
	{
		type: 'function',
		inputs: [
			{
				name: 'destinationChainSelector',
				internalType: 'uint64',
				type: 'uint64'
			},
			{
				name: 'message',
				internalType: 'struct Client.EVM2AnyMessage',
				type: 'tuple',
				components: [
					{ name: 'receiver', internalType: 'bytes', type: 'bytes' },
					{ name: 'data', internalType: 'bytes', type: 'bytes' },
					{
						name: 'tokenAmounts',
						internalType: 'struct Client.EVMTokenAmount[]',
						type: 'tuple[]',
						components: [
							{ name: 'token', internalType: 'address', type: 'address' },
							{ name: 'amount', internalType: 'uint256', type: 'uint256' }
						]
					},
					{ name: 'feeToken', internalType: 'address', type: 'address' },
					{ name: 'extraArgs', internalType: 'bytes', type: 'bytes' }
				]
			}
		],
		name: 'getFee',
		outputs: [{ name: 'fee', internalType: 'uint256', type: 'uint256' }],
		stateMutability: 'view'
	},
	{
		type: 'function',
		inputs: [],
		name: 'getOffRamps',
		outputs: [
			{
				name: '',
				internalType: 'struct Router.OffRamp[]',
				type: 'tuple[]',
				components: [
					{
						name: 'sourceChainSelector',
						internalType: 'uint64',
						type: 'uint64'
					},
					{ name: 'offRamp', internalType: 'address', type: 'address' }
				]
			}
		],
		stateMutability: 'view'
	},
	{
		type: 'function',
		inputs: [{ name: 'destChainSelector', internalType: 'uint64', type: 'uint64' }],
		name: 'getOnRamp',
		outputs: [{ name: '', internalType: 'address', type: 'address' }],
		stateMutability: 'view'
	},
	{
		type: 'function',
		inputs: [{ name: 'chainSelector', internalType: 'uint64', type: 'uint64' }],
		name: 'getSupportedTokens',
		outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
		stateMutability: 'view'
	},
	{
		type: 'function',
		inputs: [],
		name: 'getWrappedNative',
		outputs: [{ name: '', internalType: 'address', type: 'address' }],
		stateMutability: 'view'
	},
	{
		type: 'function',
		inputs: [{ name: 'chainSelector', internalType: 'uint64', type: 'uint64' }],
		name: 'isChainSupported',
		outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
		stateMutability: 'view'
	},
	{
		type: 'function',
		inputs: [
			{ name: 'sourceChainSelector', internalType: 'uint64', type: 'uint64' },
			{ name: 'offRamp', internalType: 'address', type: 'address' }
		],
		name: 'isOffRamp',
		outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
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
		inputs: [
			{ name: 'tokenAddress', internalType: 'address', type: 'address' },
			{ name: 'to', internalType: 'address', type: 'address' },
			{ name: 'amount', internalType: 'uint256', type: 'uint256' }
		],
		name: 'recoverTokens',
		outputs: [],
		stateMutability: 'nonpayable'
	},
	{
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
						type: 'uint64'
					},
					{ name: 'sender', internalType: 'bytes', type: 'bytes' },
					{ name: 'data', internalType: 'bytes', type: 'bytes' },
					{
						name: 'destTokenAmounts',
						internalType: 'struct Client.EVMTokenAmount[]',
						type: 'tuple[]',
						components: [
							{ name: 'token', internalType: 'address', type: 'address' },
							{ name: 'amount', internalType: 'uint256', type: 'uint256' }
						]
					}
				]
			},
			{ name: 'gasForCallExactCheck', internalType: 'uint16', type: 'uint16' },
			{ name: 'gasLimit', internalType: 'uint256', type: 'uint256' },
			{ name: 'receiver', internalType: 'address', type: 'address' }
		],
		name: 'routeMessage',
		outputs: [
			{ name: 'success', internalType: 'bool', type: 'bool' },
			{ name: 'retData', internalType: 'bytes', type: 'bytes' },
			{ name: 'gasUsed', internalType: 'uint256', type: 'uint256' }
		],
		stateMutability: 'nonpayable'
	},
	{
		type: 'function',
		inputs: [{ name: 'wrappedNative', internalType: 'address', type: 'address' }],
		name: 'setWrappedNative',
		outputs: [],
		stateMutability: 'nonpayable'
	},
	{
		type: 'function',
		inputs: [{ name: 'to', internalType: 'address', type: 'address' }],
		name: 'transferOwnership',
		outputs: [],
		stateMutability: 'nonpayable'
	},
	{
		type: 'function',
		inputs: [],
		name: 'typeAndVersion',
		outputs: [{ name: '', internalType: 'string', type: 'string' }],
		stateMutability: 'view'
	}
] as const;
