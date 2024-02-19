<script lang="ts">
	import ArticleCard from '$lib/ui/app/ArticleCard.svelte';

	export let data;
</script>

<section class="flex flex-col items-center py-24">
	<h1
		class="font-nunito mx-auto max-w-[19ch] text-center text-4xl font-black tracking-tight sm:text-5xl xl:text-6xl"
	>
		Publish <span class="text-primary">your stories</span> to the world.
	</h1>
	<p class="max-w-lg pt-5 text-center">
		Unleash the Full Potential of Decentralized Storytelling and connect with a Global Community of
		Ideas.
		<span class="block mt-3 text-xs text-muted-foreground">
			Built for the <a
				href="https://dorahacks.io/hackathon/avalanche-frontier/detail"
				class="hover:text-foreground hover:underline">Avalanche Frontier Hackathon</a
			>
		</span>
	</p>
</section>

<section class="container">
	<h2 class="text-4xl font-bold font-nunito">Featured</h2>
	<p class="mt-1 text-sm text-muted-foreground">What's hot and what's not</p>

	<div class="w-full mt-6">
		<ArticleCard article={data.featured[0]}></ArticleCard>
		<div class="grid gap-6 mt-6 md:grid-cols-2 xl:grid-cols-3">
			{#each data.featured.slice(1) as article, i}
				<ArticleCard {article}></ArticleCard>
			{/each}
		</div>
	</div>
</section>


<section class="container mt-12">
	<h2 class="text-4xl font-bold font-nunito">Recently Published</h2>
	<p class="mt-1 text-sm text-muted-foreground">Fresh off the press</p>

	<div class="w-full mt-6">
		<div class="grid gap-6 mt-6 md:grid-cols-2 xl:grid-cols-3">
			{#each data.recent as article, i}
				<ArticleCard {article}></ArticleCard>
			{/each}
		</div>
	</div>
</section>

<div class="container py-32 text-white bg-black rounded-lg dark:bg-background dark:text-inherit">
	<div class="grid items-center grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2">
		<div class="w-full max-w-xl mx-auto lg:mx-0">
			<h2 class="text-3xl font-bold tracking-tight">Built with Web3's most powerful technology</h2>
			<p class="mt-6 text-lg leading-8 text-muted-foreground text-pretty">
				Summit harnesses the power of Web3 technology for unparalleled security and scalability. Our
				platform is built on the most advanced tools, ensuring a seamless experience for creators
				and readers alike.
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
			<img
				class="object-contain object-center w-full col-span-2 max-h-12"
				src="/logos/particle.webp"
				alt="Particle"
				width="158"
				height="48"
			/>
		</div>
	</div>
</div>
