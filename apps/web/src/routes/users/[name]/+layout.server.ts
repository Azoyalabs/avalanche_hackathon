import type { LayoutServerLoad } from './$types';
import { COVALENT_API_KEY } from '$env/static/private';
import { CovalentClient, Chains } from '@covalenthq/client-sdk';
import type { ExpectedResponse } from '../../api/nfts/[id]/+server';
import { createClient, getContract, http } from 'viem';
import { abi as AvyyyABI } from '$lib/contracts/nameService/abi';
import { avalanche } from 'viem/chains';
import { NAME_SERVICE_ADDRESS, SUMMIT_ADDRESS } from '$lib/constants';
import { supabase } from '$lib/supabase';

export const load = (async ({ params, fetch }) => {
	const avvyyClient = getContract({
		address: NAME_SERVICE_ADDRESS,
		abi: AvyyyABI,
		client: createClient({
			transport: http(),
			chain: avalanche
		})
	});

	let userName: string | null = await avvyyClient.read.reverseResolveEVMToName([
		params.name as `0x${string}`
	]);
	userName = userName === '' ? null : userName;

	let userAvatar: string | null = null;
	if (userName) {
		const readAvatarResponse = await avvyyClient.read.resolveStandard([userName, BigInt(7)]);
		if (readAvatarResponse !== '') {
			userAvatar = readAvatarResponse;
		}
	}

	const covalentClient = new CovalentClient(COVALENT_API_KEY);
	const ownedNFTs = await covalentClient.NftService.getNftsForAddress(
		Chains.AVALANCHE_TESTNET,
		params.name,
		{
			noNftAssetMetadata: true,
			withUncached: true
		}
	);

	const collection = ownedNFTs.data.items.filter(
		(coll) => coll.contract_address === SUMMIT_ADDRESS
	)[0];

	let backedArticles: ExpectedResponse[] = [];
	if (collection) {
		const ownedTokens = collection.nft_data.map((t) => t.token_id as bigint);

		backedArticles = await Promise.all(
			ownedTokens.map(async (id) => {
				const response = await fetch(`/api/nfts/${id}`);
				const value = (await response.json()) as ExpectedResponse;
				return value;
			})
		);
	}

	const { data: publishedArticles } = await supabase
		.from('article')
		.select('*')
		.filter('author_address', 'eq', params.name);

	
	return {
		publishedArticles: publishedArticles!.map((a) => ({ ...a, full_body: `${a.full_body!.substring(0,140)}...` })),
		ownedArticles: backedArticles,
		userName,
		userAvatar
	};
}) satisfies LayoutServerLoad;
