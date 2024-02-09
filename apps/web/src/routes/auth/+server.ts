import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	//request.
	const data = (await request.json()) as { address: string };
	//const theme = data.get('theme') === 'light' ? 'light' : 'dark';
	//cookies.set('theme', theme);
	const userAddress = data['address'];
	console.log('received data: ', JSON.stringify(data));
	if (userAddress) {
		cookies.set('address', userAddress, { path: '/' });
	} else {
		cookies.delete('address', { path: '/' });
	}
	return new Response();
};

/*
export const actions = {
	default: async ({ cookies, request }) => {
		
	}
} satisfies Actions;
*/
