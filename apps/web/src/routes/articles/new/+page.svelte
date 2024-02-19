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
	// TODO: we need to react to the form and it's articleID in order to prompt the actual tx
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

		/*
		return toast.promise<Awaited<typeof txPromise>>(txPromise, {
			loading: 'Sending Transaction...',
			success: (hash) => {
				return 'Transaction successful! \n' + hash;
			},
			error: (err) => {
				console.error(err);
				return `Error: ${err}`;
			}
		});*/
	};
</script>

{#if form && form?.tokenID}
	<div class="flex flex-col items-center justify-center p-8 mt-6 border rounded-lg shadow min-h-20">
		<div class="text-sm">
			<!-- {form?.tokenID} -->
			Everything's set up!
		</div>
		<Button
			class="mt-2"
			on:click={() => {
				mintNFT(form.tokenID);
			}}>Mint your token</Button
		>
	</div>
{:else if data.access === AccessStatus.Unknown}
	<!-- TODO: user needs to connect and request approval.  -->

	<div>Request access to write</div>
{:else if data.access === AccessStatus.Banned}
	<!-- TODO: redesign  -->
	<div>You're banned</div>
{:else}
	<PublishForm form={data.form}></PublishForm>
{/if}
