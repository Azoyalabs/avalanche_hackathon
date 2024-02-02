import type { LayoutLoad } from './$types';
import { createPublicClient, http, getContract } from 'viem';
import { avalancheFuji } from 'viem/chains';
import { abi as ERC20_ABI } from '$lib/contracts/ERC20/abi.ts';
import { BnM_TOKEN_ADDRESS } from '$lib/constants';

export const load = (async () => {
	const QUERY_CLIENT = createPublicClient({
		chain: avalancheFuji,
		transport: http()
	});

	const BnM_CONTRACT = getContract({
		address: BnM_TOKEN_ADDRESS,
		abi: ERC20_ABI,
		client: QUERY_CLIENT
	});

	return {
		contracts: {
			BnM_CONTRACT
		}
	};
}) satisfies LayoutLoad;
