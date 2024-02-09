import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, params }) => {
	console.dir(locals);
	console.dir(params);
	if (locals.userAddress !== params.name) {
		console.log('redirecting');
		redirect(302, `/users/${params.name}`);
	}
}) satisfies PageServerLoad;
