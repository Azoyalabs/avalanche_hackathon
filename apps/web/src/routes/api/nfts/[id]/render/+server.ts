import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import NotoSans from '$lib/assets/NotoSans-Regular.ttf';
import { read } from '$app/server';
import { html as toReactNode } from 'satori-html';
import NftRender from './NftRender.svelte';

import type { RequestHandler } from './$types';

const fontData = read(NotoSans).arrayBuffer();

const height = 630;
const width = 1200;

export const GET: RequestHandler = async ({ params, url }) => {
	const result = NftRender.render();
	const element = toReactNode(`${result.html}<style>${result.css.code}</style>`);
	const svg = await satori(element, {
		fonts: [
			{
				name: 'Noto Sans',
				data: await fontData,
				style: 'normal'
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

export type yep = Awaited<ReturnType<typeof GET>>;
