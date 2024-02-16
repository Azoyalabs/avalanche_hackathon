<script lang="ts">
	import '../app.pcss';
	import { navigating } from '$app/stores';
	import { Button } from '$lib/ui/shadcn/ui/button';
	import { Toaster } from '$lib/ui/shadcn/ui/sonner';
	import { MountainSnow } from 'lucide-svelte';
	import {
		ParticleConnect,
		metaMask,
		type ConnectConfig,
		type EVMProvider
	} from '@particle-network/connect';

	import {
		PUBLIC_PARTICLE_APP_ID,
		PUBLIC_PARTICLE_CLIENT_KEY,
		PUBLIC_PARTICLE_PROJECT_ID
	} from '$env/static/public';
	import {
		AvalancheTestnet,
		type Chain,
		BNBChainTestnet,
		EthereumGoerli
	} from '@particle-network/chains';

	import * as Drawer from '$lib/ui/shadcn/ui/drawer';
	import AvatarGenerator from '$lib/ui/app/AvatarGenerator/AvatarGenerator.svelte';

	import * as Sheet from '$lib/ui/shadcn/ui/sheet';
	import SheetBody from '$lib/ui/app/SheetBody/SheetBody.svelte';
	import { setUserStoreState } from '$lib/state';
	import { derived } from 'svelte/store';
	import { APP_LINKS } from '$lib/links';
	import Address from '$lib/ui/app/Address/Address.svelte';
	import { delay } from '$lib/utils';
	import { setContext } from 'svelte';
	import { GITHUB_LINK, TWITTER_LINK } from '$lib/constants.js';

	// TODO: support other chains for crosschain minting
	const config: ConnectConfig = {
		projectId: PUBLIC_PARTICLE_PROJECT_ID,
		clientKey: PUBLIC_PARTICLE_CLIENT_KEY,
		appId: PUBLIC_PARTICLE_APP_ID,
		chains: [AvalancheTestnet as Chain, BNBChainTestnet as Chain, EthereumGoerli as Chain]
	};
	export let data;

	setContext('SUMMIT', data.contracts.SUMMIT_CONTRACT);

	const userStore = setUserStoreState(null);
	$: address = derived(userStore.address, ($address) => $address);

	async function connectToParticle() {
		const particle = new ParticleConnect(config);
		const provider = (await particle.connect()) as EVMProvider;
		const store = await userStore.connect(provider);

		// TODO: How do we switch network with particle?
		 
		// Wait for address query
		await delay(200);
		await fetch('/auth', {
			body: JSON.stringify({
				address: $address
			}),
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'POST'
		});
	}

	async function disconnect() {
		if (userStore) {
			userStore.disconnect();
		}
		
	}

	$: isConnected = derived(userStore.isConnected, ($connection) => $connection);
</script>

<Toaster />

<header class="py-3 border-b">
	<div class="container flex items-center justify-between">
		<a class="flex items-center" href="/">
			<img src="/favicon.png" alt="logo" class="w-8 h-8" />
			<span class="ml-2 text-2xl font-black uppercase font-nunito">Summit</span>
		</a>
		<div class="flex items-center space-x-3">
			{#if $isConnected}
				<Button href="/articles/new" variant="default">Start Writing</Button>

				<Sheet.Root>
					<Sheet.Trigger class="hidden md:block">
						<Button size="icon" variant="ghost" class="rounded-full">
							<AvatarGenerator
								props={{
									name: 'archway18m26lkjly2hkck25t7sdsrnu72x0g6gxdxxr4q',
									colors: ['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90'],
									square: false
								}}
							></AvatarGenerator>
						</Button>
					</Sheet.Trigger>
					<Sheet.Content>
						<Sheet.Header>
							<div class="flex items-center space-x-3">
								<div class="h-9 w-9">
									<AvatarGenerator
										props={{
											name: 'archway18m26lkjly2hkck25t7sdsrnu72x0g6gxdxxr4q',
											colors: ['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90'],
											square: false
										}}
									></AvatarGenerator>
								</div>
								<div>
									<Sheet.Title>
										<Address address={$address}></Address>
									</Sheet.Title>
									<Sheet.Description asChild>
										<Sheet.Close asChild let:builder>
											<Button
												href={APP_LINKS.USER_PROFILE($address)}
												builders={[builder]}
												variant="ghost"
												size="sm"
												class="px-0 py-0 text-muted-foreground hover:bg-transparent"
												>View Profile</Button
											>
										</Sheet.Close>
									</Sheet.Description>
								</div>
							</div>
						</Sheet.Header>
						<SheetBody></SheetBody>
						<Sheet.Footer>
							<Button variant="ghost" on:click={() => disconnect()}>Disconnect</Button>
						</Sheet.Footer>
					</Sheet.Content>
				</Sheet.Root>

				<Drawer.Root>
					<Drawer.Trigger class="md:hidden">
						<Button size="icon" variant="ghost" class="rounded-full">
							<AvatarGenerator
								props={{
									name: 'archway18m26lkjly2hkck25t7sdsrnu72x0g6gxdxxr4q',
									colors: ['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90'],
									square: false
								}}
							></AvatarGenerator>
						</Button>
					</Drawer.Trigger>
					<Drawer.Content>
						<Drawer.Header class="flex items-center space-x-3">
							<div class="h-9 w-9">
								<AvatarGenerator
									props={{
										name: 'archway18m26lkjly2hkck25t7sdsrnu72x0g6gxdxxr4q',
										colors: ['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90'],
										square: false
									}}
								></AvatarGenerator>
							</div>
							<div class="flex flex-col text-left">
								<Drawer.Title>0x18979...absje6</Drawer.Title>
								<Drawer.Description>View Profile</Drawer.Description>
							</div>
						</Drawer.Header>
						<SheetBody></SheetBody>
						<Drawer.Footer>
							<Button variant="ghost" on:click={() => disconnect()}>Disconnect</Button>
						</Drawer.Footer>
					</Drawer.Content>
				</Drawer.Root>
			{:else}
				<Button on:click={connectToParticle}>Connect wallet</Button>
			{/if}
		</div>
	</div>
</header>

<div class="flex-grow">
	{#if $navigating}
		<div class="flex flex-col items-center justify-center min-h-screen">
			<MountainSnow class="animate-ping duration-[2000ms]"></MountainSnow>
		</div>
	{:else}
		<slot />
	{/if}
</div>

<footer class="">
	<div class="px-6 py-20 mx-auto overflow-hidden max-w-7xl sm:py-24 lg:px-8">
		<nav class="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
			<div class="pb-6">
				<a href="/" class="text-sm leading-6 text-muted-foreground hover:text-foreground"
					>Home</a
				>
			</div>
			<div class="pb-6">
				<a href="/analytics" class="text-sm leading-6 text-muted-foreground hover:text-foreground"
					>Analytics</a
				>
			</div>
		</nav>
		<div class="flex justify-center mt-10 space-x-10">
			<a href="{TWITTER_LINK}" class="text-muted-foreground hover:text-foreground">
				<span class="sr-only">X</span>
				<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path
						d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z"
					/>
				</svg>
			</a>
			<a href="{GITHUB_LINK}" class="text-muted-foreground hover:text-foreground">
				<span class="sr-only">GitHub</span>
				<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path
						fill-rule="evenodd"
						d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
						clip-rule="evenodd"
					/>
				</svg>
			</a>
		</div>
		<p class="mt-10 text-xs leading-5 text-center text-muted-foreground">
			&copy; {new Date().getFullYear()}
			{'Azoyalabs'}. All rights reserved.
		</p>
	</div>
</footer>
