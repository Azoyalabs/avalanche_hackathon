<script lang="ts">
	import * as Card from '$lib/ui/shadcn/ui/card';
	import { LayoutLink, setLayoutContext } from '../context';

	setLayoutContext(LayoutLink.Stats);
	export let data;
</script>

<div class="space-y-12">
	<section class="">
		<h3 class="text-2xl font-medium">Summit Activity</h3>

		<div class="grid gap-4 mt-2 md:grid-cols-2 lg:grid-cols-3">
			<div
				class="flex flex-col items-center p-4 border rounded-lg shadow-sm bg-card text-card-foreground md:p-6"
			>
				<div class="text-xs text-muted-foreground md:text-sm">First Publication</div>
				<div class="mt-2 md:text-lg">{data.firstPublished ? data.firstPublished.toLocaleString() : 'Never Published'}</div>
			</div>

			<div
				class="flex flex-col items-center p-4 border rounded-lg shadow-sm bg-card text-card-foreground md:p-6"
			>
				<div class="text-xs text-muted-foreground md:text-sm">Publication Count</div>
				<div class="mt-2 md:text-lg">{data.publishCount}</div>
			</div>

			<div
				class="flex flex-col items-center p-4 border rounded-lg shadow-sm bg-card text-card-foreground md:p-6"
			>
				<div class="text-xs text-muted-foreground md:text-sm">Access Status</div>
				<div class="mt-2 md:text-lg">{["Unknown","Authorized","Banned"][data.accessStatus]}</div>
			</div>
		</div>
	</section>

	<section class="">
		<h3 class="text-2xl font-medium">Active Chains</h3>
		<div class="grid gap-4 mt-2 md:grid-cols-2 lg:grid-cols-3">
			{#if data.activeChains.length > 0}
				{#each data.activeChains as activeChain}
					<Card.Root>
						<Card.Content class="flex items-center py-3 space-x-3 ">
							<div>
								<img src={activeChain.logo} class="w-12 h-12 rounded-full" alt="" />
							</div>
							<div>
								<div class="text-xs text-muted-foreground">
									{activeChain.name} ({activeChain.id})
								</div>

								<div class="mt-1">
									{activeChain.label}
								</div>
							</div>
						</Card.Content>
					</Card.Root>
				{/each}
			{:else}
				<div
					class="flex flex-col items-center p-6 border rounded-lg shadow-sm bg-card text-card-foreground"
				>
					<div class="text-sm text-muted-foreground">No active chain found</div>
				</div>
			{/if}
		</div>
	</section>
</div>
