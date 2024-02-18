<script lang="ts">
	import { BnM_FAUCET, CHAINLINK_FAUCET } from '$lib/links';
	import { Button } from '$lib/ui/shadcn/ui/button';
	import { formatERC20 } from '$lib/utils';

	export let balance: bigint = BigInt(0);
</script>

<div class="px-4 py-4 space-y-4 md:px-0 md:pb-4 md:pt-4">
	<div class="flex items-center p-4 space-x-2 border rounded-lg">
		<img src="/logos/BnM.avif" alt="BnM Logo" class="w-6 h-6" />
		<div>
			{formatERC20(balance, 18, 'BnM')}
		</div>
	</div>
	<div class="grid w-full grid-cols-2 gap-4 mt-4">
		<Button href={BnM_FAUCET} variant="outline">Get BnM Token</Button>
		<Button href={CHAINLINK_FAUCET} variant="outline">Chainlink Faucet</Button>
	</div>
</div>
