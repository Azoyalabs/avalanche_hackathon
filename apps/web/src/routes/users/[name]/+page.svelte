<script lang="ts">
	import type { Article } from '$lib/models/article';
	import ArticleCard from '$lib/ui/app/ArticleCard.svelte';
<<<<<<< HEAD
	import { getRelevantAttribute } from '$lib/utils';
	import { LayoutLink, setLayoutContext } from './context';

	// TODO: remove faker
	export let data;
=======
	import AvatarGenerator from '$lib/ui/app/AvatarGenerator/AvatarGenerator.svelte';
	import SubscriptionCard from '$lib/ui/app/SubscriptionCard.svelte';

	// TODO: remove faker
	import { faker } from '@faker-js/faker';

>>>>>>> 9f81bf4 (web: add /articles/[id] page mockup, including support for generated avatars)
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

	setLayoutContext(LayoutLink.Published);

	$: preppedArticles = data.ownedArticles.map((a) => {
		return {
			title: a.name,
			publishDate: new Date(
				getRelevantAttribute<{ trait_type: 'Published'; value: number }>(
					'Published',
					a.attributes
				).value
			),
			preview: getRelevantAttribute<{ trait_type: 'Preview'; value: string }>(
				'Preview',
				a.attributes
			).value,
			author: {
				name: getRelevantAttribute<{ trait_type: 'Author'; value: string }>('Author', a.attributes)
					.value,
				address: '0xthingy...split',
				avatar: 'https://miro.medium.com/v2/resize:fill:24:24/1*OkvxzWk0qB6UnnGRo-aDAQ.png'
			}
		};
	});
</script>

<section class="gap-6 mt-6">
	{#if preppedArticles.length > 0}
		<div class="grid md:grid-cols-2 xl:grid-cols-3">
			{#each preppedArticles as article, i}
				<ArticleCard {article}></ArticleCard>
			{/each}
		</div>
	{:else}
		<div class="w-full p-6 border rounded-lg">
			<h3>No article written by this user</h3>
		</div>
	{/if}
</section>
