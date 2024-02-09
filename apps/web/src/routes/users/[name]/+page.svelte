<script lang="ts">
	import type { Article } from '$lib/models/article';
	import ArticleCard from '$lib/ui/app/ArticleCard.svelte';
	import { getRelevantAttribute } from '$lib/utils';
	import { LayoutLink, setLayoutContext } from './context';

	// TODO: remove faker
	export let data;
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

<section class="grid gap-6 mt-6 md:grid-cols-2 xl:grid-cols-3">
	<!-- 
	{#each new Array(6)
		.fill(null)
		.map( (_) => ({ title: 'Article title', publishDate: new Date(), preview: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam volutpat placerat vehicula. Fusce eget rutrum tellus, ac sodales risus. Nam maximus quis neque quis cursus. Vivamus dolor diam, mollis eget pretium quis, porta ut justo.', author: { name: 'author name', avatar: 'https://miro.medium.com/v2/resize:fill:24:24/1*OkvxzWk0qB6UnnGRo-aDAQ.png' } }) ) as article, i}
		<ArticleCard {article}></ArticleCard>
	{/each}
	 -->
	<!-- FIXME: besoin d'un DTO -->
	{#each preppedArticles as article, i}
		<ArticleCard {article}></ArticleCard>
	{/each}
</section>
