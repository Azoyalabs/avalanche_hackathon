import { CovalentClient, Chains } from '@covalenthq/client-sdk';

import type { PageServerLoad } from './$types';
import { COVALENT_API_KEY } from '$env/static/private';
import { supabase } from '$lib/supabase';
import { createClient, getContract, http } from 'viem';
import { abi } from '$lib/contracts/summit';
import { SUMMIT_ADDRESS } from '$lib/constants';
import { avalancheFuji } from 'viem/chains';
import type { AccessStatus } from '$lib/types/access';

export const load = (async ({ params }) => {
	const client = new CovalentClient(COVALENT_API_KEY);

	const { data: activeChains } = await client.BaseService.getAddressActivity(params.name, {
		testnets: true
	});

	const firstPublished = await supabase
		.from('article')
		.select('publication_date')
		.order('publication_date', { ascending: false })
		.filter('author_address', 'eq', params.name)
		.limit(1)
		.single();

	const summit = getContract({
		abi: abi,
		address: SUMMIT_ADDRESS,
		client: createClient({
			transport: http(),
			chain: avalancheFuji
		})
	});

	const accessStatus: AccessStatus = await summit.read.accessStatusTracker([
		params.name as `0x${string}`
	]);
	const publishCount = await summit.read.idTracker([params.name as `0x${string}`]);
	return {
		activeChains: activeChains.items.map((a) => {
			return {
				logo: a.logo_url,
				label: a.label,
				name: a.name,
				id: a.chain_id
			};
		}),
		publishCount: publishCount.toString(),
		firstPublished: firstPublished.data?.publication_date
			? new Date(firstPublished.data?.publication_date)
			: null,
		accessStatus
	};
}) satisfies PageServerLoad;
