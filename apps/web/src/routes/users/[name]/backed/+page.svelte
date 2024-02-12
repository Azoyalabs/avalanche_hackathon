<script lang="ts">
	import { LayoutLink, setLayoutContext } from '../context';
	import ArticleCard from '$lib/ui/app/ArticleCard.svelte';

	setLayoutContext(LayoutLink.Backed);

	// TODO: link up data
	let backedArticles = [];
</script>

<section class="gap-6 mt-6">
	{#if backedArticles.length > 0}
		<div class="grid md:grid-cols-2 xl:grid-cols-3">
			{#each new Array(6)
				.fill(null)
				.map( (_) => ({ title: 'Article title', publishDate: new Date(), preview: 'article preview', author: { name: 'author name', avatar: 'https://miro.medium.com/v2/resize:fill:24:24/1*OkvxzWk0qB6UnnGRo-aDAQ.png' } }) ) as article, i}
				<ArticleCard {article}></ArticleCard>
			{/each}
		</div>
	{:else}
		<div class="w-full p-6 border rounded-lg">
			<h3>No article backed by this user</h3>
		</div>
	{/if}
</section>
