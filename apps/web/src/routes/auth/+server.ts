import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const data = (await request.json()) as { address: string };
	const userAddress = data['address'];

	console.log('received data: ', JSON.stringify(data));
// TODO: link up to disconnect
	if (userAddress) {
		cookies.set('address', userAddress, { path: '/' });
	} else {
		cookies.delete('address', { path: '/' });
	}
	return new Response();
};
