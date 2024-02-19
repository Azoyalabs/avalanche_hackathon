import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { AuthorAttribute, PreviewAttribute, PublishedAttribute } from '$lib/utils';
import { supabase } from '$lib/supabase';

const IN_APP_URL = (protocol: string, host: string, id: number | string) =>
	`${protocol}//${host}/articles/${id}`;

export const GET: RequestHandler = async ({ params, url }) => {
	const { data, error: err } = await supabase
		.from('article')
		.select('*')
		.filter('id', 'eq', params.id)
		.limit(1)
		.single();

	if (err) {
		error(404, "This article doesn't exist");
	}
	// NOTE: most metadata stuff is explained on opensea -> https://docs.opensea.io/docs/metadata-standards
	if (data) {
		const external_url = IN_APP_URL(url.protocol, url.host, params.id);
		const nft = {
			description: data.description,
			// This is the URL that will appear below the asset's image on OpenSea and will allow users to leave OpenSea and view the item on your site.
			external_url,
			image: `${url.href}/render`,
			name: data.title,
			attributes: [
				{
					trait_type: 'Author',
					value: data.author_address
				},
				{
					display_type: 'date',
					trait_type: 'Published',
					// Pass in a unix timestamp (seconds) as the value.
					value: new Date(data.publication_date!).valueOf() //new Date(data.publication_date!).valueOf() //Math.floor(new Date().valueOf())
				},
				{
					trait_type: 'Preview',
					value: `${data.full_body!.substring(0, 140)}...`
				},
				{
					trait_type: 'Header',
					value: data.header_image
				}
			]
		};

		return json(nft);
	} else {
		error(404);
	}
};
export type ExpectedResponse = {
	name: string;
	external_url: string;
	image: string;
	attributes: (PublishedAttribute | AuthorAttribute | PreviewAttribute)[];
};
