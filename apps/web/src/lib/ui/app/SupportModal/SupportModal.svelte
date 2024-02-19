<script lang="ts">
	import * as Dialog from '$lib/ui/shadcn/ui/dialog';
	import { Label } from '$lib/ui/shadcn/ui/label';
	import * as Select from '$lib/ui/shadcn/ui/select';
	import { AvalancheTestnet, BNBChainTestnet, type ChainInfo } from '@particle-network/chains';

	export let price: number | null = null;
	export let selectedNetwork: { value: ChainInfo; label: string } = {
		value: AvalancheTestnet,
		label: AvalancheTestnet.name
	};

	const networks = [AvalancheTestnet, BNBChainTestnet];
</script>

<Dialog.Content class="sm:max-w-[425px]">
	<Dialog.Header>
		<Dialog.Title>Support the author</Dialog.Title>
	</Dialog.Header>
	<div class="grid gap-4 py-4">
		<div class="text-sm text-muted-foreground">
			{#if price}
				<div>This is a paid article, payment is required to read it.</div>
			{:else}
				<div>This is a free article, back it for free!</div>
			{/if}
		</div>
		<div class="">
			<Label class="text-right">Pay from Network (Testnet)</Label>
			<Select.Root bind:selected={selectedNetwork}>
				<Select.Trigger class="mt-1">
					<Select.Value placeholder="Fuji" />
				</Select.Trigger>
				<Select.Content>
					{#each networks as network}
						<Select.Item value={network} class="flex items-center space-x-2">
							<img src={network.icon} alt="" class="w-6 h-6 mr-2" />
							<div>
								{network.name}
							</div>
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
	</div>
	<Dialog.Footer>
		<slot {selectedNetwork} />
	</Dialog.Footer>
</Dialog.Content>
