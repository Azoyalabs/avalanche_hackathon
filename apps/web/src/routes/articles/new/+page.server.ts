import { createClient, getContract, http } from 'viem';
import type { PageServerLoad } from './$types';
import { abi as SummitABI } from '$lib/contracts/summit';
import { SUMMIT_ADDRESS } from '$lib/constants';
import { avalancheFuji } from 'viem/chains';
import { AccessStatus } from '$lib/types/access';
import { superValidate } from 'sveltekit-superforms/server';
import { publishSchema } from '$lib/schemas/PublishSchema';
import { supabase } from '$lib/supabase.js';
import { createTokenId, parseTokenId } from 'summit-utils';
import { fail } from '@sveltejs/kit';
import { uploadFile } from '$lib/ipfs.js';

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
		const formData = await event.request.formData();
		const image = formData.get('image') as File;

		const author = event.locals.userAddress as `0x${string}`;
		const form = await superValidate(formData, publishSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const uploaded = await uploadFile(image);

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

		const tokenID = createTokenId(author, articleID, !form.data.free);

		const inserted = await supabase.from('article').insert({
			id: tokenID.toString(),
			author_address: author,
			full_body: form.data.content,
			header_image: uploaded.fastUrl,
			description: form.data.description,
			publication_date: new Date().toUTCString(),
			title: form.data.title,
			tag: 'unknown'
		});
		if (inserted.error) {
			console.error(inserted.error);
		}
		return {
			form,
			tokenID
		};
	}
};
