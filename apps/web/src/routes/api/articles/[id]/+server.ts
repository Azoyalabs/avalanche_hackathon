import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';




export const GET: RequestHandler = async ({ params }) => {
	const title = 'article title';
	const authorAvatar =
		'https://images.mirror-media.xyz/publication-images/sPyyAY1axpIFmxpI-BhwB.png?height=600&width=600';
	const authorName = 'abc';
	const minterAvatars = new Array(4).fill(
		'https://images.mirror-media.xyz/publication-images/N-MMkKx65X408ZIdF99M8.png?height=592&width=592'
	) as string[];

	return json({
		title,
		author: {
			avatar: authorAvatar,
			name: authorName
		},
		minters: minterAvatars
	});
};


export type yep = Awaited<ReturnType<typeof GET>>;
