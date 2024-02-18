import { createClient, getContract, http } from 'viem';
import type { PageServerLoad } from './$types';
import { abi as SummitABI } from '$lib/contracts/summit';
import { SUMMIT_ADDRESS } from '$lib/constants';
import { avalancheFuji } from 'viem/chains';
import { AccessStatus } from '$lib/types/access';
import { superValidate } from 'sveltekit-superforms/server';
import { publishSchema } from '$lib/schemas/PublishSchema';
import { supabase } from '$lib/supabase.js';

export const load = (async ({ locals }) => {
	const summitContract = getContract({
		abi: SummitABI,
		address: SUMMIT_ADDRESS,
		client: createClient({
			chain: avalancheFuji,
			transport: http()
		})
	});

	let access = AccessStatus.Unknown;

	if (locals.userAddress) {
		access = await summitContract.read.accessStatusTracker([locals.userAddress]);
	}
	return {
		access,
		form: await superValidate(publishSchema)
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		/*
		const formData = await request.formData();
		console.dir(formData);
		*/
		const author = event.locals.userAddress as `0x${string}`;
		const form = await superValidate(event, publishSchema);
		// TODO: send everything needed for creation

		/*
		const account = mnemonicToAccount(WHITELISTER_PASSPHARE);

		const summitContract = getContract({
			abi: SummitABI,
			address: SUMMIT_ADDRESS,
			client: createWalletClient({
				transport: http(),
				account,
				chain: avalancheFuji
			})
		});

		const id = await summitContract.read.idTracker([author]);
		console.log(`expected id is ${id}`)
*/

		// Send back ID
		const summitContract = getContract({
			abi: SummitABI,
			address: SUMMIT_ADDRESS,
			client: createClient({
				transport: http(),
				chain: avalancheFuji
			})
		});

		const articleID = await summitContract.read.idTracker([author]);

		// TODO: store header somewhere
		form.data.image as File;
		const headerURL = '';

		const inserted = await supabase.from('article').insert({
			id: articleID.toString(),
			author_address: author,
			full_body: form.data.content,
			header_image: headerURL,
			description: '',
			publication_date: new Date().toUTCString(),
			title: form.data.title,
			tag: 'unknown'
		});
		return {
			form,
			articleID
		};
	}
};
