<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';
	import { Separator } from '$lib/ui/shadcn/ui/separator';
	import { Button, buttonVariants } from '$lib/ui/shadcn/ui/button';
	import * as Dialog from '$lib/ui/shadcn/ui/dialog';
	import * as Card from '$lib/ui/shadcn/ui/card';

	import * as Avatar from '$lib/ui/shadcn/ui/avatar';
	import SubscriptionCard from '$lib/ui/app/SubscriptionCard/SubscriptionCard.svelte';
	import SupportModal from '$lib/ui/app/SupportModal/SupportModal.svelte';
	import { toast } from 'svelte-sonner';
	import { APP_LINKS } from '$lib/links.js';
	import { getUserStoreState } from '$lib/state.js';
	import {
		bytesToHex,
		createWalletClient,
		custom,
		getContract,
		toBytes,
		toHex,
		type WalletClient
	} from 'viem';
	import { avalancheFuji, bscTestnet } from 'viem/chains';
	import { BnM_TOKEN_ADDRESS, SUMMIT_ADDRESS, SUMMIT_RECEIVER_ADDRESS } from '$lib/constants.js';
	import { abi as summitABI } from '$lib/contracts/summit/abi.js';
	import { abi as BNMABI } from '$lib/contracts/ERC20/abi.js';
	import { page } from '$app/stores';
	import type { ChainInfo } from '@particle-network/chains';
	import { goto } from '$app/navigation';

	export let data;

	let showSupportModal = false;
	const { isConnected, client, provider, address: userAddress } = getUserStoreState();

	function makeCrossChain() {}

	function makeSameChain(walletClient: WalletClient) {
		const bnmContract = getContract({
			address: BnM_TOKEN_ADDRESS,
			abi: BNMABI,
			client: walletClient
		});

		const summitContract = getContract({
			address: SUMMIT_ADDRESS,
			abi: summitABI,
			client: walletClient
		});

		let txPromise = bnmContract.write.transferAndCall(
			[
				SUMMIT_RECEIVER_ADDRESS as `0x${string}`,
				BigInt(0),
				bytesToHex(toBytes(BigInt($page.params.id)))
			],
			{
				account: $userAddress! as `0x${string}`,
				value: undefined
			}
		);

		return txPromise;
	}
	const promiser = async (chainInfo: ChainInfo) => {
		const walletClient = createWalletClient({
			chain: avalancheFuji,
			//chain: bscTestnet,
			transport: custom($provider!)
		});

		try {
			console.log(`Switching to ${chainInfo.name}`);
			await walletClient.switchChain({
				//id: bscTestnet.id
				id: chainInfo.id
			});
		} catch (error) {
			console.log('threw when switchchain');
			console.error(error);
		}

		const bnmContract = getContract({
			address: BnM_TOKEN_ADDRESS,
			abi: BNMABI,
			client: walletClient
		});

		const summitContract = getContract({
			address: SUMMIT_ADDRESS,
			abi: summitABI,
			client: walletClient
		});

		// TODO: get mintprice if paying contract
		// summitContract.read.mintPrice();

		let txPromise = bnmContract.write.transferAndCall(
			[
				SUMMIT_RECEIVER_ADDRESS as `0x${string}`,
				BigInt(0),
				bytesToHex(toBytes(BigInt($page.params.id)))
			],
			{
				account: $userAddress! as `0x${string}`
			}
		);

		// We switch back to fuji
		await walletClient.switchChain({
			id: avalancheFuji.id
		});

		return toast.promise<Awaited<typeof txPromise>>(txPromise, {
			loading: 'Sending Transaction...',
			success: (hash) => {
				return 'Transaction successful! \n' + hash;
			},
			error: (err) => {
				console.error(err);
				return `Error: ${err}`;
			}
		});
	};
</script>

<div
	class="container max-w-4xl space-y-8 prose-sm prose dark:prose-invert prose-orange sm:prose-base lg:prose-xl prose-img:rounded-xl smoothscroll"
>
	<div class="">
		<img
			src="https://images.mirror-media.xyz/publication-images/yClkyV3zTvmXOt1cvcksN.png?height=596&amp;width=1192"
			alt={data.article.title}
			class="rounded-xl"
		/>
		<h1 class="mt-10">{data.article.title}</h1>
		<div class="flex items-center justify-between mt-6 not-prose">
			<div class="flex items-center">
				<a
					href={APP_LINKS.USER_PROFILE(data.article.author.address)}
					class="flex items-center group"
				>
					<Avatar.Root class="border">
						<Avatar.Image src={data.article.author.avatar} alt={data.article.author.name} />
						<Avatar.Fallback
							>{data.article.author.name
								.split(' ')
								.map((chars) => chars[0])
								.join()}
						</Avatar.Fallback>
					</Avatar.Root>
					<span class="ml-2 text-muted-foreground group-hover:text-foreground">
						{data.article.author.name || data.article.author.address}
					</span>
				</a>
			</div>
			<div class="flex items-center space-x-3" id="support">
				{#if $isConnected}
					<Dialog.Root bind:open={showSupportModal}>
						<Dialog.Trigger class={buttonVariants({ variant: 'default', size: 'sm' })}>
							Support
						</Dialog.Trigger>
						<SupportModal let:selectedNetwork>
							<Button
								on:click={() => {
									console.dir(selectedNetwork);
									showSupportModal = false;
									promiser(selectedNetwork.value);
								}}>Support the author</Button
							>
						</SupportModal>
					</Dialog.Root>
				{:else}
					<div class="text-xs">Connect to support</div>
				{/if}
			</div>
		</div>
	</div>
	<Separator></Separator>
	<article class="mt-8">
		<SvelteMarkdown source={data.article.content} />
	</article>

	<div class="grid grid-cols-2 grid-rows-1 gap-8 not-prose">
		<SubscriptionCard name={data.article.author.name}></SubscriptionCard>

		<Card.Root class="relative">
			<Card.Header>
				<Card.Title>Info</Card.Title>
				<Card.Description>Dive deeper into the Token info</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-6 text-sm">
				<div>
					<div class="text-xs font-bold uppercase text-muted-foreground">Token ID</div>
					<div class="mt-2" title={$page.params.id}>
						{$page.params.id.substring(0, 12)}...{$page.params.id.substring(
							$page.params.id.length - 12
						)}
					</div>
				</div>
				<div class="">
					<div class="text-xs font-bold uppercase text-muted-foreground">View on</div>
					<div class="mt-2 space-y-2">
						<div>
							<a
								href={`https://testnets.opensea.io/assets/avalanche-fuji/${SUMMIT_ADDRESS}/${$page.params.id}`}
								class="hover:underline">OpenSea</a
							>
						</div>
						<div>
							<a
								href={`https://testnet.snowtrace.io/nft/${SUMMIT_ADDRESS}/${$page.params.id}?chainId=43113`}
								class="hover:underline">Snowtrace</a
							>
						</div>
					</div>
				</div>
			</Card.Content>
			<Card.Footer class="absolute bottom-0 right-0">
				<Button href="/users/{data.article.author.address}" variant="outline"
					>View Author profile</Button
				>
			</Card.Footer>
		</Card.Root>

		<Card.Root class="">
			<Card.Header>
				<Card.Title>Show your support</Card.Title>
				<Card.Description class="">
					<div>Get a NFT when supporting the Author</div>
				</Card.Description>
			</Card.Header>
			<Card.Content class="">
				<img src="/api/nfts/{$page.params.id}/render" alt="NFT" class="rounded-md" />
			</Card.Content>
			<Card.Footer>
				<Button
					on:click={() => {
						const supportElement = document.querySelector('#support');
						window.scroll({
							top: supportElement?.clientTop,
							behavior: 'smooth'
						});
					}}>Support</Button
				>
			</Card.Footer>
		</Card.Root>
	</div>
</div>

<style>
	:global(html) {
		scroll-behavior: smooth;
	}
</style>
