import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { AuthorAttribute, PreviewAttribute, PublishedAttribute } from '$lib/utils';

const IN_APP_URL = (id: number | string) => `http://localhost:5173/articles/${id}`;
export const GET: RequestHandler = async ({ params, url }) => {
	// NOTE: most metadata stuff is explained on opensea -> https://docs.opensea.io/docs/metadata-standards
	const nft = {
		description: 'Short description of the article',
		// This is the URL that will appear below the asset's image on OpenSea and will allow users to leave OpenSea and view the item on your site.
		external_url: IN_APP_URL(params.id),
		image: `${url.href}/render`,
		name: 'Title of the article',
		attributes: [
			{
				trait_type: 'Author',
				value: '0xmon_kul'
			},
			{
				display_type: 'date',
				trait_type: 'Published',
				// Pass in a unix timestamp (seconds) as the value.
				value: Math.floor(new Date().valueOf())
			},
			{
				trait_type: 'Preview',
				value: 'This is a metadata contained preview'
			}
		]
	};

	return json(nft);
};
export type ExpectedResponse = {
	name: string;
	external_url: string;
	image: string;
	attributes: (PublishedAttribute | AuthorAttribute | PreviewAttribute)[];
};
