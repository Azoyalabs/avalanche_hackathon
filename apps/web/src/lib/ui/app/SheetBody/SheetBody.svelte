<script lang="ts">
	import { BnM_FAUCET, CHAINLINK_FAUCET } from '$lib/links';
	import { Button } from '$lib/ui/shadcn/ui/button';

	export let balance: bigint = BigInt(0);
</script>

<div class="px-4 py-4 space-y-4 md:pb-4 md:pt-4 md:px-0">
	<div class="p-4 border rounded-lg">balance in link BnM token</div>
	<div class="grid w-full grid-cols-2 gap-4 mt-4">
		<Button href="{BnM_FAUCET}" variant="outline">Get BnM Token</Button>
		<Button href="{CHAINLINK_FAUCET}"  variant="outline">Chainlink Faucet</Button>
	</div>
</div>
