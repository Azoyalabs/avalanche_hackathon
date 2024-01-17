<script lang="ts">
	import * as Card from '$lib/ui/shadcn/ui/card';
	export let name: string;
</script>

<Card.Root class="col-span-2 rounded-xl">
	<Card.Content class="flex items-center justify-between py-4">
		<div>
			<h5 class="font-medium">Subscribe to {name}</h5>
			<p class="text-sm text-muted-foreground">
				Be notified of new articles directly in your inbox
			</p>
		</div>

		<div class="text-sm text-right text-muted-foreground">Not available on Testnet</div>
	</Card.Content>
</Card.Root>
