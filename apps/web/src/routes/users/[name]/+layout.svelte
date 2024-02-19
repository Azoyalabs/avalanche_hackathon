<script lang="ts">
	import { page } from '$app/stores';
	import AvatarGenerator from '$lib/ui/app/AvatarGenerator/AvatarGenerator.svelte';
	import SubscriptionCard from '$lib/ui/app/SubscriptionCard/SubscriptionCard.svelte';
	import { derived, writable } from 'svelte/store';
	import { CONTEXT_KEY, LayoutLink } from './context';
	import { onMount, setContext } from 'svelte';
	import { getUserStoreState } from '$lib/state';
	import Button from '$lib/ui/shadcn/ui/button/button.svelte';

	export let data;

	const currentLink = writable(LayoutLink.Published);
	setContext(CONTEXT_KEY, currentLink);

	const LINK_TO = (link: LayoutLink) => {
		return `/users/${$page.params.name}/${link}`;
	};

	const userStore = getUserStoreState();
	$: isCurrentUser = derived(userStore.address, ($address) => {
		return $address === $page.params.name;
	});
</script>

<div class="container space-y-8">
	<section class="pt-12 space-y-6">
		<div class="flex flex-col items-center">
			<div class="w-20 overflow-hidden rounded-lg">
				{#if data.userAvatar}
					<img src={data.userAvatar} alt="" />
				{:else}
					<AvatarGenerator
						props={{
							name: data.userName || $page.params.name,
							colors: ['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90'],
							square: true
						}}
					></AvatarGenerator>
				{/if}
			</div>
			<h1 class="mt-2 text-lg font-bold lg:text-2xl">
				{#if data.userName}
					{data.userName}
				{:else}
					{$page.params.name.substring(0, 8)}...{$page.params.name.substring(
						$page.params.name.length - 8
					)}
				{/if}
			</h1>
			{#if data.userName}
				<div class="mt-1 text-sm text-muted-foreground">
					{$page.params.name}
				</div>
			{/if}
			{#if !data.userName && $isCurrentUser}
				<div class="w-full p-6 mt-4 text-sm border rounded-lg text-muted-foreground">
					<h3 class="font-medium text-white">Customize your profile using Avvyy</h3>

					<div class="flex items-center justify-between">
						Avvvyy is the leading avalanche name service <Button href="https://avvy.domains/" target="_blank" variant="ghost"
							>Get your own domain</Button
						>
					</div>
				</div>
			{/if}
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

	{#if !$isCurrentUser}
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
