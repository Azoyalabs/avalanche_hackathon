import { supabase } from '$lib/supabase';
import { error } from '@sveltejs/kit';
import type { ExpectedResponse } from '../../api/nfts/[id]/+server';
import type { PageServerLoad } from './$types';
import { getContract, createClient, http } from 'viem';
import { avalanche, avalancheFuji } from 'viem/chains';
import { abi as AvyyyABI } from '$lib/contracts/nameService/abi';
import { abi as SummitABI } from '$lib/contracts/summit';

import { parseTokenId } from 'summit-utils';
import { COVALENT_API_KEY } from '$env/static/private';
import { CovalentClient, Chains } from '@covalenthq/client-sdk';
import { NAME_SERVICE_ADDRESS, SUMMIT_ADDRESS } from '$lib/constants';

export const load = (async ({ fetch, params, locals }) => {
	// ------- SETUP ---------
	const avvyyClient = getContract({
		address: NAME_SERVICE_ADDRESS,
		abi: AvyyyABI,
		client: createClient({
			transport: http(),
			chain: avalanche
		})
	});

	const id = params.id;

	const { userAddress } = locals;

	const article = await supabase
		.from('article')
		.select('*')
		.filter('id', 'eq', params.id)
		.limit(1)
		.single();

	if (!article.data) {
		error(404, "This article doesn't exist");
	}

	// TODO: compute if NFT requires payment

	// TODO: compute access
	/**
	 * If free -> everyone has access
	 * If paid -> | User has paid for it -> has access
	 * 			  | User hasn't paid for it -> no access, should be able to prompt for payment
	 */
	const parsedToken = parseTokenId(BigInt(id));
	const isPaidArticle = parsedToken.isPaying;

	// TODO: make sure this is ok
	let hasAccess = !isPaidArticle && userAddress !== undefined;

	const summitClient = getContract({
		address: SUMMIT_ADDRESS,
		abi: SummitABI,
		client: createClient({
			transport: http(),
			chain: avalancheFuji
		})
	});

	// TODO: do we want a "has backed" field?
	if (userAddress) {
		/*
		NOTE: UNAVAILABLE ON TESTNET
		const covalentClient = new CovalentClient(COVALENT_API_KEY);

		
		const ownership = await covalentClient.NftService.checkOwnershipInNftForSpecificTokenId(
			Chains.AVALANCHE_TESTNET,
			userAddress,
			SUMMIT_ADDRESS,
			params.id
		);
		*/

		const userBalance = await summitClient.read.balanceOf([
			userAddress! as `0x${string}`,
			BigInt(params.id)
		]);
		if (userBalance > BigInt(0)) {
			hasAccess = true;
		}
	}

	// TODO: Do we need this? all the info should be coming from our backend
	const articleNFT = (await (await fetch(`/api/nfts/${id}`)).json()) as ExpectedResponse;

	const content = hasAccess ? article.data!.full_body : article.data?.full_body!.substring(200);

	// ------- AUTHOR INFO ---------
	let authorName: string | null = await avvyyClient.read.reverseResolveEVMToName([
		article.data!.author_address as `0x${string}`
	]);
	authorName = authorName === '' ? null : authorName;

	let authorAvatar: string | null = null;
	if (authorName) {
		const readAvatarResponse = await avvyyClient.read.resolveStandard([authorName, BigInt(7)]);
		if (readAvatarResponse !== '') {
			authorAvatar = readAvatarResponse;
		}
	}

	return {
		article: {
			title: article.data.title,
			author: {
				name: authorName,
				address: article.data!.author_address,
				avatar: authorAvatar
			},
			content: content,
			access: hasAccess,
			banner: article.data?.header_image,
			isPaid: isPaidArticle
		}
	};
}) satisfies PageServerLoad;
