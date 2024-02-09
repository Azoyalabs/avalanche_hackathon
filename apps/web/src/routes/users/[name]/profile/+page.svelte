<script lang="ts">
	import { Button, buttonVariants } from '$lib/ui/shadcn/ui/button';
	import { Check, Copy } from 'lucide-svelte';
	import { LayoutLink, setLayoutContext } from '../context';
	import * as Card from '$lib/ui/shadcn/ui/card';
	import { page } from '$app/stores';
	import FeedbackButton from '$lib/ui/app/FeedbackButton/FeedbackButton.svelte';

	setLayoutContext(LayoutLink.Profile);

	$: referalLink = `${$page.url.host}?ref=${$page.params.name}`;
	$: profileLink = `${$page.url.href}`;
</script>

<div class="grid gap-6 md:grid-cols-2">
	<Card.Root>
		<Card.Header>
			<Card.Title>Your rewards</Card.Title>
			<Card.Description>description</Card.Description>
		</Card.Header>

		<Card.Content>
			<div>rewards amount</div>
		</Card.Content>
		<Card.Footer>
			<Button>Claim Rewards</Button>
		</Card.Footer>
	</Card.Root>

	<Card.Root class="overflow-hidden">
		<Card.Header>
			<Card.Title>Referral Link</Card.Title>
			<Card.Description>description</Card.Description>
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
			<Card.Description>description</Card.Description>
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
