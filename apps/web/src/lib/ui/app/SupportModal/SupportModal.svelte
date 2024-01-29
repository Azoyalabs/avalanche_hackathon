<script lang="ts">
	import * as Dialog from '$lib/ui/shadcn/ui/dialog';
	import { Input } from '$lib/ui/shadcn/ui/input';
	import { Label } from '$lib/ui/shadcn/ui/label';
	import { Button, buttonVariants } from '$lib/ui/shadcn/ui/button';

	export let price: number | null = null;
</script>

<Dialog.Content class="sm:max-w-[425px]">
	<Dialog.Header>
		<Dialog.Title>Support the author</Dialog.Title>
		<Dialog.Description>Support explanation</Dialog.Description>
	</Dialog.Header>
	<div class="grid gap-4 py-4">
		<div class="">
			{#if price}
				<div>paid article so compulsory support</div>
			{:else}
				<div>free article so optional support</div>
			{/if}
		</div>
		<div class="">
			<Label class="text-right">Amount</Label>
			<div class="relative mt-2 rounded-md shadow-sm">
				<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
					<span class="text-muted-foreground sm:text-sm">$</span>
				</div>
				<Input
					type="number"
					name="price"
					id="price"
					class="block w-full rounded-md  py-1.5 pl-7 pr-12 "
					placeholder="0.00"
					step="0.01"
					aria-describedby="price-currency"
				/>
				<div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
					<span class="text-gray-500 sm:text-sm" id="price-currency">USD</span>
				</div>
			</div>
		</div>
	</div>
	<Dialog.Footer>
		<Button on:click>Support the author</Button>
	</Dialog.Footer>
</Dialog.Content>
