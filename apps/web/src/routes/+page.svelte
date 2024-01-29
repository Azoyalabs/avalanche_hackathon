<script lang="ts">
	import {
		PUBLIC_PARTICLE_APP_ID,
		PUBLIC_PARTICLE_CLIENT_KEY,
		PUBLIC_PARTICLE_PROJECT_ID
	} from '$env/static/public';
	//import { Ethereum, EthereumGoerli } from '@particle-network/chains';
	import ArticleCard from '$lib/ui/app/ArticleCard.svelte';

	/*
	import {
		type Chain,
		type ConnectConfig,
		ParticleConnect,
		type Provider,
		metaMask,
		walletconnect
	} from '@particle-network/connect';
	import { onMount } from 'svelte';
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
	*/

	const article = {
		title: 'Featured Article title',
		publishDate: new Date(),
		preview:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam volutpat placerat vehicula. Fusce eget rutrum tellus, ac sodales risus. Nam maximus quis neque quis cursus. Vivamus dolor diam, mollis eget pretium quis, porta ut justo.',
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
				.map( (_) => ({ title: 'Article title', publishDate: new Date(), preview: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam volutpat placerat vehicula. Fusce eget rutrum tellus, ac sodales risus. Nam maximus quis neque quis cursus. Vivamus dolor diam, mollis eget pretium quis, porta ut justo.', author: { name: 'author name', avatar: 'https://miro.medium.com/v2/resize:fill:24:24/1*OkvxzWk0qB6UnnGRo-aDAQ.png' } }) ) as article, i}
				<ArticleCard {article}></ArticleCard>
			{/each}
		</div>
	</div>
</section>

<section class="container mt-12">
	<h2 class="text-3xl font-bold font-nunito">Latest publications</h2>
	<p>Fresh off the press</p>
</section>

<div class="container py-32">
	<div class="grid items-center grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2">
		<div class="w-full max-w-xl mx-auto lg:mx-0">
			<h2 class="text-3xl font-bold tracking-tight ">
				Built with Web3's most powerful technology
			</h2>
			<p class="mt-6 text-lg leading-8 text-muted-foreground">
				Fight bots, chain agnostic, etc...Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et, egestas tempus tellus etiam
				sed. Quam a scelerisque amet ullamcorper eu enim et fermentum, augue.
			</p>
		</div>
		<div
			class="grid items-center w-full max-w-xl grid-cols-2 mx-auto gap-y-12 sm:gap-y-14 lg:mx-0 lg:max-w-none lg:pl-8"
		>
			<img
				class="object-contain object-left w-full text-white max-h-12"
				src="/logos/chainlink-logo.svg"
				alt="Chainlink"
				width="105"
				height="48"
			/>
			<img
				class="object-contain object-left w-full max-h-12"
				src="/logos/avvyy.svg"
				alt="Avvy"
				width="104"
				height="48"
			/>
			<img
				class="object-contain object-left w-full max-h-12"
				src="/logos/covalent.png"
				alt="Covalent"
				width="140"
				height="48"
			/>
			<img
				class="object-contain object-left w-full max-h-12"
				src="/logos/avalanche.svg"
				alt="Avalanche"
				width="136"
				height="48"
			/>
			<!-- 
			<img
				class="object-contain object-left w-full max-h-12"
				src="https://tailwindui.com/img/logos/statamic-logo-white.svg"
				alt="Statamic"
				width="147"
				height="48"
			/>
			 -->
			 <div></div>
			<img
				class="object-contain object-left w-full max-h-12"
				src="/logos/particle.webp"
				alt="Particle"
				width="158"
				height="48"
			/>
		</div>
	</div>
</div>
