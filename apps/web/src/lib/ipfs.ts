import { read } from '$app/server';

import avvyy from '$lib/assets/avvyy.svg';
import { PUBLIC_PARTICLE_PROJECT_ID } from '$env/static/public';
import { PARTICLE_SERVER_KEY } from '$env/static/private';

const UPLOAD_FILE_IPFS_URL = 'https://rpc.particle.network/ipfs/upload';

// FIXME: allow feeding in an object (blob?)
export async function uploadFile() {
	const formData = new FormData();
	// formData.append: see https://docs.particle.network/developers/other-services/node-service/ipfs-service

	const file = read(avvyy);

	formData.append('file', await file.blob());
	const resp = await fetch(UPLOAD_FILE_IPFS_URL, {
		method: 'POST',
		body: formData,
		headers: new Headers({
			Authorization: `Basic ${Buffer.from(
				`${PUBLIC_PARTICLE_PROJECT_ID}:${PARTICLE_SERVER_KEY}`
			).toString('base64')}`
		})
	});
	const json = await resp.json();
	console.dir(json);
	return json;
}

export async function uploadJson(json: Record<string, unknown>) {
	const UPLOAD_JSON_IPFS_URL = 'https://rpc.particle.network/ipfs/upload_json';

	const resp = await fetch(UPLOAD_JSON_IPFS_URL, {
		method: 'POST',
		body: JSON.stringify(json),
		headers: new Headers({
			Authorization: `Basic ${Buffer.from(
				`${PUBLIC_PARTICLE_PROJECT_ID}:${PARTICLE_SERVER_KEY}`
			).toString('base64')}`,
			'Content-Type': 'application/json'
		})
	});

    return await resp.json()
}
