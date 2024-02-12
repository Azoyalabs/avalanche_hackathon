import { uploadFile, uploadJson } from '$lib/ipfs';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	try {
		const uploadResponse = await uploadJson({"hello": "world"});
		return json(uploadResponse);
	} catch (err ) {
		error(500, {
			message: (err as Error).message
		});
	}
};
