import type { PageServerLoad } from './$types';

export const load = (async ({locals}) => {
    console.dir(locals)
    return {};
}) satisfies PageServerLoad;