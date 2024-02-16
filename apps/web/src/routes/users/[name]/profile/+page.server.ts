import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, params }) => {
	if (locals.userAddress !== params.name) {
		redirect(302, `/users/${params.name}`);
	}
}) satisfies PageServerLoad;
