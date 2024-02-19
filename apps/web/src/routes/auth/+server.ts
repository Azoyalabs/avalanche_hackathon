import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const data = (await request.json()) as { address: string };
	const userAddress = data['address'];

	if (userAddress) {
		cookies.set('address', userAddress, { path: '/' });
	} else {
		cookies.delete('address', { path: '/' });
	}
	return new Response();
};
