<script lang="ts">
	import { page } from '$app/stores';
	import ArticleCard from '$lib/ui/app/ArticleCard.svelte';
	import { getRelevantAttribute } from '$lib/utils';
	import { LayoutLink, setLayoutContext } from './context';

	export let data;

	setLayoutContext(LayoutLink.Published);

	const IN_APP_URL = (protocol: string, host: string, id: number | string) =>
		`${protocol}//${host}/articles/${id}`;

	$: preppedArticles = data.publishedArticles.map((a) => {
		return {
			title: a.title!,
			publishDate: new Date(a.publication_date!),
			preview: a.full_body,
			description: a.description,
			banner: a.header_image,
			author: {
				name: a.author_address,
				address: a.author_address,
				avatar: 'https://miro.medium.com/v2/resize:fill:24:24/1*OkvxzWk0qB6UnnGRo-aDAQ.png'
			},
			url: IN_APP_URL($page.url.protocol, $page.url.host, a.id)
		};
	});
</script>

<section class="mt-6">
	{#if preppedArticles.length > 0}
		<div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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
