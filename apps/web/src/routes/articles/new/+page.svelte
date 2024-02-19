<script lang="ts">
	import { page } from '$app/stores';
	import { BnM_TOKEN_ADDRESS, SUMMIT_ADDRESS, SUMMIT_RECEIVER_ADDRESS } from '$lib/constants.js';
	import { AccessStatus } from '$lib/types/access';
	import PublishForm from '$lib/ui/app/PublishForm/PublishForm.svelte';
	import { Button } from '$lib/ui/shadcn/ui/button';
	import { toast } from 'svelte-sonner';
	import { createWalletClient, custom, getContract, bytesToHex, toBytes } from 'viem';
	import { avalancheFuji } from 'viem/chains';
	import type { ActionData } from './$types.js';
	import { abi as SummitABI } from '$lib/contracts/summit/abi.js';
	import { getUserStoreState } from '$lib/state';
	import { abi as BnMABI } from '$lib/contracts/ERC20/abi.js';
	import { transactionToaster } from '$lib/utils.js';
	import { goto } from '$app/navigation';

	export let data;

	$: summitClient = (() => {})();

	export let form: ActionData;
	const { provider, address: userAddress } = getUserStoreState();
	// NOTE: we need to react to the form and it's articleID in order to prompt the actual tx
	// Since we have the article ID, we can redirect on success without an issue

	const mintNFT = async (id: bigint) => {
		const walletClient = createWalletClient({
			chain: avalancheFuji,
			//chain: bscTestnet,
			transport: custom($provider!)
		});

		const summitContract = getContract({
			address: SUMMIT_ADDRESS,
			abi: SummitABI,
			client: walletClient
		});

		const bnmContract = getContract({
			address: BnM_TOKEN_ADDRESS,
			abi: BnMABI,
			client: walletClient
		});

		let txPromise = bnmContract.write.transferAndCall(
			[SUMMIT_RECEIVER_ADDRESS as `0x${string}`, BigInt(0), bytesToHex(toBytes(id))],
			{
				account: $userAddress! as `0x${string}`
			}
		);

		const toast = transactionToaster(txPromise);

		await txPromise;

		await goto(`/articles/${id.toString()}`);
	};

	const { isConnected } = getUserStoreState();

	let verificationQuery: null | string = null;
	async function requestVerification() {
		const resp = await fetch('/api/auth/whitelist');
		const json: { txHash: string } = await resp.json();
		verificationQuery = json.txHash;
	}
</script>

{#if form && form?.tokenID}
	<div class="flex flex-col items-center justify-center p-8 mt-6 border rounded-lg shadow min-h-20">
		<div class="text-sm">Everything's set up!</div>
		<Button
			class="mt-2"
			on:click={() => {
				mintNFT(form.tokenID);
			}}>Mint your token</Button
		>
	</div>
{:else if data.access === AccessStatus.Unknown}
	<div class="flex flex-col items-center justify-center p-6 mt-6 border rounded-lg">
		{#if verificationQuery}
			<div>Access requested. This may take up to a few minutes</div>
			<Button
				href="https://testnet.snowtrace.io/tx/{verificationQuery}?chainId=43113"
				variant="outline"
				class="mt-2">View Transaction</Button
			>
		{:else}
			<div>Request access to write</div>
			<Button
				disabled={$isConnected === false}
				class="mt-2"
				on:click={() => {
					requestVerification();
				}}>Request verification</Button
			>
		{/if}
	</div>
{:else if data.access === AccessStatus.Banned}
	<div class="p-6 mt-6 border rounded-lg">You're Banned.</div>
{:else}
	<PublishForm form={data.form}></PublishForm>
{/if}
