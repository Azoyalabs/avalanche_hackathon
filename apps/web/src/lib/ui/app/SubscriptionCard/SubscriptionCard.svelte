<script lang="ts">
	import * as Card from '$lib/ui/shadcn/ui/card';
	export let name: string;

	$: isAvyyy = name.endsWith("avax")
	$: display = isAvyyy ? name : `${name.substring(0, 8)}...${name.substring(name.length - 8)}`;
</script>

<Card.Root class="block col-span-2 rounded-xl">
	<Card.Content class="flex flex-col justify-between gap-6 py-4 lg:flex-row lg:items-center">
		<div>
			<h5 class="font-medium">
				Subscribe to {display}
			</h5>
			<p class="text-sm text-muted-foreground">
				Be notified of new articles directly in your inbox
			</p>
		</div>

		<div class="text-sm text-right text-muted-foreground">Not available on Testnet</div>
	</Card.Content>
</Card.Root>
