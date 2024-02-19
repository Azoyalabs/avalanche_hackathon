<script lang="ts">
	import { Button, buttonVariants } from '$lib/ui/shadcn/ui/button';
	import { Check, Copy } from 'lucide-svelte';
	import { LayoutLink, setLayoutContext } from '../context';
	import * as Card from '$lib/ui/shadcn/ui/card';
	import { page } from '$app/stores';
	import FeedbackButton from '$lib/ui/app/FeedbackButton/FeedbackButton.svelte';
	import { getContext } from 'svelte';
	import { formatERC20, transactionToaster } from '$lib/utils';
	import { getUserStoreState } from '$lib/state';
	import { createWalletClient, getContract } from 'viem';
	import { SUMMIT_ADDRESS } from '$lib/constants';
	import { abi as SummitABI } from '$lib/contracts/summit';
	import { avalancheFuji } from 'viem/chains';
	import { Sun, Moon } from 'lucide-svelte';
	import { toggleMode } from 'mode-watcher';

	setLayoutContext(LayoutLink.Profile);

	const summitClient = getContext('SUMMIT');
	$: rewards = summitClient.read.aggregated([$page.params.name]) as Promise<bigint>;

	$: referalLink = `${$page.url.host}?ref=${$page.params.name}`;
	$: profileLink = `${$page.url.toString()}`;

	const { client: walletClient, address } = getUserStoreState();

	$: summitWriter = getContract({
		abi: SummitABI,
		address: SUMMIT_ADDRESS,
		client: $walletClient!
	});

	async function claimRewards() {
		const tx = summitWriter.write.withdraw({
			account: $address!
		});

		await $walletClient!.switchChain({
			//id: bscTestnet.id
			id: avalancheFuji.id
		});

		await transactionToaster(tx);

		rewards = summitClient.read.aggregated([$page.params.name]);
	}
</script>

<div class="grid gap-6 md:grid-cols-2">
	<Card.Root>
		<Card.Header>
			<Card.Title>Your rewards</Card.Title>
			<Card.Description>Get rewarded by publishing on Summit</Card.Description>
		</Card.Header>

		<Card.Content>
			{#await rewards then resolved}
				<div>
					{formatERC20(resolved, 18, 'BnM')} claimable
				</div>
			{/await}
		</Card.Content>
		<Card.Footer>
			{#await rewards then resolved}
				{#if resolved === BigInt(0)}
					<Button disabled>No Rewards to claim</Button>
				{:else}
					<Button on:click={claimRewards}>Claim Rewards</Button>
				{/if}
			{/await}
		</Card.Footer>
	</Card.Root>

	<Card.Root class="overflow-hidden">
		<Card.Header>
			<Card.Title>Referral Link</Card.Title>
			<Card.Description>Share summit with your friends and followers</Card.Description>
		</Card.Header>

		<Card.Content>
			<div class="relative py-2 overflow-hidden border rounded-lg">
				<div
					class="w-full px-2 text-sm break-all text-muted-foreground text-clip whitespace-nowrap"
				>
					{referalLink}
				</div>
				<FeedbackButton
					let:feedback
					class="absolute top-0 bottom-0 right-0 z-10 bg-background text-muted-foreground"
					on:click={() => {
						navigator.clipboard.writeText(referalLink);
					}}
				>
					{#if feedback}
						<Check></Check>
					{:else}
						<Copy />
					{/if}
				</FeedbackButton>
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root class="overflow-hidden">
		<Card.Header>
			<Card.Title>Profile Link</Card.Title>
			<Card.Description>Share a direct link to your profile</Card.Description>
		</Card.Header>

		<Card.Content>
			<div class="relative py-2 overflow-hidden border rounded-lg">
				<div
					class="w-full px-2 text-sm break-all text-muted-foreground text-clip whitespace-nowrap"
				>
					{profileLink}
				</div>
				<FeedbackButton
					let:feedback
					class="absolute top-0 bottom-0 right-0 z-10 bg-background text-muted-foreground"
					on:click={() => {
						navigator.clipboard.writeText(profileLink);
					}}
				>
					{#if feedback}
						<Check></Check>
					{:else}
						<Copy />
					{/if}
				</FeedbackButton>
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>Settings</Card.Title>
			<Card.Description>Customize your stay</Card.Description>
		</Card.Header>

		<Card.Content>
			<div class="flex items-center">
				<Button on:click={toggleMode} variant="outline" size="icon">
					<Sun
						class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
					/>
					<Moon
						class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
					/>
				</Button>

				<div class="ml-2 text-sm">Toggle Theme</div>
			</div>
		</Card.Content>
	</Card.Root>
</div>
