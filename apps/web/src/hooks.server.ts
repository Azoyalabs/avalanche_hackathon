import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, locals, resolve }) => {
	const address = event.cookies.get('address');
	event.locals.userAddress = address;
	
	const response = await resolve(event);
	return response;
};
