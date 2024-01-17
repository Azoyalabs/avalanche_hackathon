<script lang="ts">

	import {
		PUBLIC_PARTICLE_APP_ID,
		PUBLIC_PARTICLE_CLIENT_KEY,
		PUBLIC_PARTICLE_PROJECT_ID
	} from '$env/static/public';
	import { Ethereum, EthereumGoerli } from '@particle-network/chains';
	import {
		type Chain,
		type ConnectConfig,
		ParticleConnect,
		type Provider,
		metaMask,
		walletconnect
	} from '@particle-network/connect';
	import { onMount } from 'svelte';
	import ArticleCard from '$lib/ui/app/ArticleCard.svelte';

	const config: ConnectConfig = {
		projectId: PUBLIC_PARTICLE_PROJECT_ID,
		clientKey: PUBLIC_PARTICLE_CLIENT_KEY,
		appId: PUBLIC_PARTICLE_APP_ID,
		chains: [Ethereum as Chain, EthereumGoerli as Chain],
		wallets: [
			metaMask({
				projectId: import.meta.env.VITE_APP_WALLETCONNECT_PROJECT_ID,
				showQrModal: false
			}),
			walletconnect({
				projectId: import.meta.env.VITE_APP_WALLETCONNECT_PROJECT_ID,
				showQrModal: true
			})
		]
	};

	//const connectKit = new ParticleConnect(config);

	onMount(() => {
		//connectKit.connect();
	});

	const article = {
		title: 'Featured Article title',
		publishDate: new Date(),
		preview: 'article preview',
		author: {
			name: 'author name',
			avatar: 'https://miro.medium.com/v2/resize:fill:24:24/1*OkvxzWk0qB6UnnGRo-aDAQ.png'
		}
	};
</script>

<!-- {PUBLIC_PARTICLE_CLIENT_KEY} -->

<section class="flex flex-col items-center py-24">
	<h1
		class="font-nunito mx-auto max-w-[19ch] text-center text-4xl font-black tracking-tight sm:text-5xl xl:text-6xl"
	>
		Publish <span class="text-primary">your stories</span> to the world.
	</h1>
	<p class="max-w-lg pt-5 text-center">
		Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer gravida sollicitudin velit ac
		bibendum. Donec quis dui mi. Fusce volutpat commodo turpis vel pretium.
	</p>
</section>

<section class="container">
	<h2 class="text-4xl font-bold font-nunito">Featured</h2>
	<p class="mt-1 text-sm text-muted-foreground">What's hot and what's not</p>

	<div class="w-full mt-6">
		<ArticleCard {article}></ArticleCard>
		<div class="grid gap-6 mt-6 md:grid-cols-2 xl:grid-cols-3">
			{#each new Array(6)
				.fill(null)
				.map( (_) => ({ title: 'Article title', publishDate: new Date(), preview: 'article preview', author: { name: 'author name', avatar: 'https://miro.medium.com/v2/resize:fill:24:24/1*OkvxzWk0qB6UnnGRo-aDAQ.png' } }) ) as article, i}
				<ArticleCard {article}></ArticleCard>
			{/each}
		</div>
	</div>
</section>

<section class="container mt-12">
	<h2 class="text-3xl font-bold font-nunito">Latest publications</h2>
	<p>Fresh off the press</p>
</section>
