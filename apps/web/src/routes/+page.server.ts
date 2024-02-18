import { SUMMIT_PUBLISHING_ADDRESS } from '$lib/constants';
import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';

const IN_APP_URL = (protocol: string, host: string, id: number | string) =>
	`${protocol}//${host}/articles/${id}`;

export const load = (async ({ url }) => {
	const { data: articles } = await supabase
		.from('article')
		.select('*')
		.in('author_address', [SUMMIT_PUBLISHING_ADDRESS]);

	return {
		featured: articles!
			.map((a) => {
				return {
					...a,
					full_body: `${a.full_body!.substring(0, 140)}...`
				};
			})
			.map((a) => {
				return {
					title: a.title!,
					publishDate: new Date(a.publication_date!),
					preview: a.full_body,
                    description: a.description,
					author: {
						name: a.author_address,
						address: a.author_address,
						avatar: 'https://miro.medium.com/v2/resize:fill:24:24/1*OkvxzWk0qB6UnnGRo-aDAQ.png'
					},
					url: IN_APP_URL(url.protocol, url.host, a.id)
				};
			})
	};
}) satisfies PageServerLoad;
