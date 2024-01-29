<script lang="ts">
	import { LayoutLink, setLayoutContext } from '../context';
	import type { Article } from '$lib/models/article';
	import ArticleCard from '$lib/ui/app/ArticleCard.svelte';

	setLayoutContext(LayoutLink.Backed);

	import { faker } from '@faker-js/faker';

	const backedArticles: Omit<Article, 'content'>[] = new Array(10).fill(null).map(() => {
		return {
			title: faker.lorem.words(6),
			publishDate: faker.date.past(),
			preview: faker.lorem.words(20),
			author: {
				name: faker.internet.displayName(),
				address: faker.finance.ethereumAddress(),
				avatar: faker.internet.avatar()
			}
		};
	});
</script>

<section class="grid gap-6 mt-6 md:grid-cols-2 xl:grid-cols-3">
	{#each new Array(6)
		.fill(null)
		.map( (_) => ({ title: 'Article title', publishDate: new Date(), preview: 'article preview', author: { name: 'author name', avatar: 'https://miro.medium.com/v2/resize:fill:24:24/1*OkvxzWk0qB6UnnGRo-aDAQ.png' } }) ) as article, i}
		<ArticleCard {article}></ArticleCard>
	{/each}
</section>
