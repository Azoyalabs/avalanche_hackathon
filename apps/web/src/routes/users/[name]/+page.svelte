<script lang="ts">
	import type { Article } from '$lib/models/article';
	import ArticleCard from '$lib/ui/app/ArticleCard.svelte';
	import AvatarGenerator from '$lib/ui/app/AvatarGenerator/AvatarGenerator.svelte';
	import SubscriptionCard from '$lib/ui/app/SubscriptionCard/SubscriptionCard.svelte';

	// TODO: remove faker
	import { faker } from '@faker-js/faker';

	const articles: Omit<Article, 'content'>[] = [
		{
			title: 'Article title',
			publishDate: new Date(),
			preview: 'article preview',
			author: {
				name: 'Author name',
				address: '0xthingy...split',
				avatar: 'https://miro.medium.com/v2/resize:fill:24:24/1*OkvxzWk0qB6UnnGRo-aDAQ.png'
			}
		}
	];

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

	const authorName = "Author Name"
</script>

<section class="pt-12 space-y-6">
	<div class="flex flex-col items-center">
		<div class="w-20">
			<AvatarGenerator
				props={{
					name: 'archway18m26lkjly2hkck25t7sdsrnu72x0g6gxdxxr4q',
					colors: ['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90'],
					square: false
				}}
			></AvatarGenerator>
		</div>
		<h1 class="mt-2 text-2xl font-bold">
			{authorName}
		</h1>
		<div class="mt-4 text-sm text-muted-foreground">
			domain and stuff. if no domain, link to avax domains to setup
		</div>
	</div>

	<div class="overflow-x-auto">
		<div class="pb-0 border-b border-muted">
			<div class="mt-3 sm:mt-4">
				<nav class="flex justify-center -mb-px space-x-8">
					<!-- Current: "border-primary-500 text-primary-600", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" -->
					<a
						href="#"
						class="px-1 pb-4 text-sm font-medium border-b-2 border-transparent text-muted-foreground hover:border-muted-foreground hover:text-foreground whitespace-nowrap"
						>Published</a
					>
					<a
						href="#"
						class="px-1 pb-4 text-sm font-medium border-b-2 text-primary border-primary whitespace-nowrap"
						aria-current="page">Backed</a
					>
					<a
						href="#"
						class="px-1 pb-4 text-sm font-medium border-b-2 border-transparent text-muted-foreground hover:border-muted-foreground hover:text-foreground whitespace-nowrap"
						>Profile (if connected?)</a
					>
					<a
						href="#"
						class="px-1 pb-4 text-sm font-medium border-b-2 border-transparent text-muted-foreground hover:border-muted-foreground hover:text-foreground whitespace-nowrap"
						>Stats</a
					>
				</nav>
			</div>
		</div>
	</div>
</section>
<SubscriptionCard name={articles[0].author.name}></SubscriptionCard>

<section class="grid gap-6 mt-6 md:grid-cols-2 xl:grid-cols-3">
	{#each new Array(6)
		.fill(null)
		.map( (_) => ({ title: 'Article title', publishDate: new Date(), preview: 'article preview', author: { name: 'author name', avatar: 'https://miro.medium.com/v2/resize:fill:24:24/1*OkvxzWk0qB6UnnGRo-aDAQ.png' } }) ) as article, i}
		<ArticleCard {article}></ArticleCard>
	{/each}
</section>
