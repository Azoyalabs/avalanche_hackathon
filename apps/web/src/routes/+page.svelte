<script lang="ts">
	import * as Avatar from '$lib/ui/shadcn/ui/avatar';

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
		<a
			class="@container hover:border-foreground/40 group block w-full overflow-hidden rounded-lg border duration-300"
			href="/"
		>
			<div class="@lg:flex h-full gap-2">
				<img
					src="https://mirror.xyz/_next/image?url=https%3A%2F%2Fimages.mirror-media.xyz%2Fpublication-images%2FVSOhY7aTvRRVzBALIeyjV.jpeg%3Fheight%3D540%26width%3D1080&w=640&q=75"
					alt={article.title}
					class="@xl:h-60 @xl:w-52 @2xl:w-2/5 h-40 w-full object-cover"
				/>
				<div class="p-4">
					<h4 class="text-xl font-bold">{article.title}</h4>
					<p class="text-xs">published: {article.publishDate.toDateString()}</p>

					<div class="text-sm text-muted-foreground">
						{article.preview}
					</div>

					<div class="flex items-center">
						<Avatar.Root class="border">
							<Avatar.Image src={article.author.avatar} alt={article.author.name} />
							<Avatar.Fallback
								>{article.author.name
									.split(' ')
									.map((chars) => chars[0])
									.join()}</Avatar.Fallback
							>
						</Avatar.Root>

						<span class="ml-2">
							{article.author.name}
						</span>
					</div>
				</div>
			</div>
		</a>
		<div class="grid gap-6 mt-6 md:grid-cols-2 xl:grid-cols-3">
			{#each new Array(6)
				.fill(null)
				.map( (_) => ({ title: 'Article title', publishDate: new Date(), preview: 'article preview', author: { name: 'author name', avatar: 'https://miro.medium.com/v2/resize:fill:24:24/1*OkvxzWk0qB6UnnGRo-aDAQ.png' } }) ) as article, i}
				<a class="@container overflow-hidden rounded-lg border" href="/">
					<div class="@lg:flex h-full gap-2">
						<img
							src="https://mirror.xyz/_next/image?url=https%3A%2F%2Fimages.mirror-media.xyz%2Fpublication-images%2FVSOhY7aTvRRVzBALIeyjV.jpeg%3Fheight%3D540%26width%3D1080&w=640&q=75"
							alt={article.title}
							class="@xl:h-60 @xl:w-52 @lg:w-40 h-40 w-full object-cover"
						/>
						<div class="p-4">
							<h4 class="text-xl font-bold">{article.title}</h4>
							<p class="text-xs">published: {article.publishDate.toDateString()}</p>

							<div class="text-sm text-muted-foreground">
								{article.preview}
							</div>

							<div class="flex items-center">
								<Avatar.Root class="border">
									<Avatar.Image src={article.author.avatar} alt={article.author.name} />
									<Avatar.Fallback
										>{article.author.name
											.split(' ')
											.map((chars) => chars[0])
											.join()}</Avatar.Fallback
									>
								</Avatar.Root>

								<span class="ml-2">
									{article.author.name}
								</span>
							</div>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<section class="container mt-12">
	<h2 class="text-3xl font-bold font-nunito">Latest publications</h2>
	<p>Fresh off the press</p>
</section>
