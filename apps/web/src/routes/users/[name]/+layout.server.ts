import type { LayoutServerLoad } from './$types';
import { COVALENT_API_KEY } from '$env/static/private';
import { CovalentClient, Chains } from '@covalenthq/client-sdk';
import type { ExpectedResponse } from '../../api/nfts/[id]/+server';
import { createClient, getContract, http } from 'viem';
import { abi as AvyyyABI } from '$lib/contracts/nameService/abi';
import { avalanche } from 'viem/chains';

export const load = (async ({ params, fetch }) => {

	const avvyyClient = getContract({
		address: "0x1c7e15C29110E51D5f55d9Deb7200fbAC6665Fae",
		abi: AvyyyABI,
		client: createClient({
			transport: http(),
			chain: avalanche
		})
	})

	let userName : string | null = await avvyyClient.read.reverseResolveEVMToName([params.name as `0x${string}`])
	userName = userName === "" ? null : userName
	console.dir(userName)

	const covalentClient = new CovalentClient(COVALENT_API_KEY);
	const ownedNFTs = await covalentClient.NftService.getNftsForAddress(
		Chains.AVALANCHE_TESTNET,
		params.name,
		{
			noNftAssetMetadata: true,
			withUncached: true
		}
	);
	//console.dir(ownedNFTs.data.items)

	const collection = ownedNFTs.data.items.filter(
		(coll) => coll.contract_address === '0x30cdaa09e7a763ca2521fe6a9710776bd7a746e6'
	)[0];
	if (collection) {
		const ownedTokens = collection.nft_data.map((t) => t.token_id as bigint);

		const ownedArticles = await Promise.all(
			ownedTokens.map(async (id) => {
				const response = await fetch(`/api/nfts/${id}`);
				const value = (await response.json()) as ExpectedResponse;
				return value;
			})
		);
		return {
			owned: ownedTokens,
			ownedArticles,
			userName,

		};
	} else {
		return {
			owned: [],
			ownedArticles: [],
			userName
		};
	}
}) satisfies LayoutServerLoad;
