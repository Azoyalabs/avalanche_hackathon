import { createWalletClient, getContract, http } from 'viem';
import type { RequestHandler } from './$types';
import { ADMIN_MNEMONIC } from '$env/static/private';
import { mnemonicToAccount } from 'viem/accounts';
import { abi } from '$lib/contracts/summit';
import { CHAINLINK_FUNCTIONS_CONSUMER, SUMMIT_ADDRESS } from '$lib/constants';
import { error, json } from '@sveltejs/kit';
import { avalancheFuji } from 'viem/chains';

import qsc from './qsc.js?raw';
import { functionConsumerAbi } from '$lib/contracts/Functions/abi';

export const GET: RequestHandler = async ({ locals }) => {
	if (locals.userAddress) {
		const whitelisteController = mnemonicToAccount(ADMIN_MNEMONIC);
		const walletClient = createWalletClient({
			account: whitelisteController,
			chain: avalancheFuji,
			transport: http()
		});

		const summitContract = getContract({
			abi: abi,
			address: SUMMIT_ADDRESS,
			client: walletClient
		});

		const functionsConsumerContract = getContract({
			abi: functionConsumerAbi,
			address: CHAINLINK_FUNCTIONS_CONSUMER,
			client: walletClient
		});

		const request = await functionsConsumerContract.write.sendRequest(
			[
				qsc,
				'0x',
				0,
				BigInt(0),
				[],
				[],
				BigInt(4179),
				300000,
				'0x66756e2d6176616c616e6368652d66756a692d31000000000000000000000000'
			],
			{
				account: whitelisteController,
				gas: BigInt(500000)
			}
		);
		return json({
			txHash: request
		});
	} else {
		error(400, 'Invalid user');
	}
};
