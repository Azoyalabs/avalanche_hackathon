import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, url }) => {
	

	return new Response("I'm rendering");
};

export type yep = Awaited<ReturnType<typeof GET>>;
