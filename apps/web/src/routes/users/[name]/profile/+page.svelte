<script lang="ts">
	import { Button, buttonVariants } from '$lib/ui/shadcn/ui/button';
	import { Check, Copy } from 'lucide-svelte';
	import { LayoutLink, setLayoutContext } from '../context';
	import * as Card from '$lib/ui/shadcn/ui/card';
	import { page } from '$app/stores';
	import FeedbackButton from '$lib/ui/app/FeedbackButton/FeedbackButton.svelte';
	import { getContext } from 'svelte';
	import { formatERC20 } from '$lib/utils';
	import { getUserStoreState } from '$lib/state';

	setLayoutContext(LayoutLink.Profile);

	const summitClient = getContext('SUMMIT');
	$: rewards = summitClient.read.aggregated([$page.params.name]) as Promise<bigint>;

	$: referalLink = `${$page.url.host}?ref=${$page.params.name}`;
	$: profileLink = `${$page.url.toString()}`;

	const userStore = getUserStoreState();
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
			<!-- TODO: interact, claim rewards -->
			<Button>Claim Rewards</Button>
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
			<Card.Description>settings description</Card.Description>
		</Card.Header>

		<Card.Content>
			<div>
				<div>night / day mode</div>
			</div>
		</Card.Content>
	</Card.Root>
</div>
