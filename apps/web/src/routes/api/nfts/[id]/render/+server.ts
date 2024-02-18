import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

import { read } from '$app/server';
import { html as toReactNode } from 'satori-html';
import NftRender from './NftRender.svelte';

import type { RequestHandler } from './$types';
import type { ExpectedResponse } from '../+server';
import { getRelevantAttribute } from '$lib/utils';

import NotoSans from '$lib/assets/NotoSans-Regular.ttf';
import NotoSansBold from '$lib/assets/NotoSans-Bold.ttf';

const fontData = read(NotoSans).arrayBuffer();
const boldFontData = read(NotoSansBold).arrayBuffer();

const height = 400;
const width = 800;

export const GET: RequestHandler = async ({ params, url, fetch }) => {
	const nftInfo = (await (await fetch(`/api/nfts/${params.id}`)).json()) as ExpectedResponse;

	const authorAddress = getRelevantAttribute<{ trait_type: 'Author'; value: string }>(
		'Author',
		nftInfo.attributes
	).value;
	const headerImage = getRelevantAttribute<{ trait_type: 'Header'; value: string }>(
		'Header',
		nftInfo.attributes
	).value;

	const result = NftRender.render({
		title: nftInfo.name,
		author: `${authorAddress.substring(0, 8)}...${authorAddress.substring(
			authorAddress.length - 8
		)}`,
		image: headerImage
	});

	const element = toReactNode(`${result.html}<style>${result.css.code}</style>`);
	const svg = await satori(element, {
		fonts: [
			{
				name: 'Noto Sans',
				data: await fontData,
				style: 'normal',
				weight: '400'
			},
			{
				name: 'Noto Sans',
				data: await boldFontData,
				weight: '700'
			}
		],
		height,
		width
	});

	const resvg = new Resvg(svg, {
		fitTo: {
			mode: 'width',
			value: width
		}
	});

	const image = resvg.render();

	return new Response(image.asPng(), {
		headers: {
			'content-type': 'image/png'
		}
	});
};
