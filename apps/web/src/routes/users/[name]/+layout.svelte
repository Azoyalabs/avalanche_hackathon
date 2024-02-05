<script lang="ts">
	import { page } from '$app/stores';
	import AvatarGenerator from '$lib/ui/app/AvatarGenerator/AvatarGenerator.svelte';
	import SubscriptionCard from '$lib/ui/app/SubscriptionCard/SubscriptionCard.svelte';
	import { derived, writable } from 'svelte/store';
	import { CONTEXT_KEY, LayoutLink } from './context';
	import { onMount, setContext } from 'svelte';
	import { getUserStoreState } from '$lib/state';

	const authorName = 'Author Name';

	const currentLink = writable(LayoutLink.Published);
	setContext(CONTEXT_KEY, currentLink);

	const LINK_TO = (link: LayoutLink) => {
		return `/users/${$page.params.name}/${link}`;
	};

	// TODO: handle has domain
	const domain = {};
	const userStore = getUserStoreState();
	$: isCurrentUser = derived(userStore.address, ($address) => {
		return $address === $page.params.name;
	});
</script>

<div class="container space-y-8">
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
						<a
							href={LINK_TO(LayoutLink.Published)}
							data-sveltekit-noscroll
							data-active={$currentLink === LayoutLink.Published}
							class="px-1 pb-4 text-sm font-medium border-b-2 whitespace-nowrap">Published</a
						>
						<a
							href={LINK_TO(LayoutLink.Backed)}
							data-sveltekit-noscroll
							data-active={$currentLink === LayoutLink.Backed}
							class="px-1 pb-4 text-sm font-medium border-b-2 whitespace-nowrap"
							aria-current="page">Backed</a
						>
						<a
							href={LINK_TO(LayoutLink.Stats)}
							data-sveltekit-noscroll
							data-active={$currentLink === LayoutLink.Stats}
							class="px-1 pb-4 text-sm font-medium border-b-2 whitespace-nowrap">Stats</a
						>
						{#if $isCurrentUser}
							<a
								href={LINK_TO(LayoutLink.Profile)}
								data-sveltekit-noscroll
								data-active={$currentLink === LayoutLink.Profile}
								class="px-1 pb-4 text-sm font-medium border-b-2 whitespace-nowrap">Profile</a
							>
						{/if}
					</nav>
				</div>
			</div>
		</div>
	</section>

	{#if $currentLink !== LayoutLink.Profile}
		<SubscriptionCard name={$page.params.name}></SubscriptionCard>
	{/if}
	<section>
		<slot />
	</section>
</div>

<style lang="postcss">
	nav > a {
		@apply text-muted-foreground border-transparent duration-200;

		&[data-active='true'] {
			@apply text-primary border-primary;
		}

		&:hover[data-active='false'] {
			@apply border-muted-foreground text-foreground;
		}
	}
</style>
