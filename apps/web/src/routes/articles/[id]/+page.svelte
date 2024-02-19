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
		encodeAbiParameters,
		getContract,
		toBytes,
		toHex,
		zeroAddress,
		type WalletClient
	} from 'viem';
	import { avalancheFuji, bscTestnet } from 'viem/chains';
	import {
		BnM_TOKEN_ADDRESS,
		CCIP_TESTNET_CONTRACTS_INFO,
		SUMMIT_ADDRESS,
		SUMMIT_RECEIVER_ADDRESS
	} from '$lib/constants.js';
	import { abi as summitABI } from '$lib/contracts/summit/abi.js';
	import { abi as BNMABI } from '$lib/contracts/ERC20/abi.js';
	import { page } from '$app/stores';
	import { AvalancheTestnet, BNBChainTestnet, type ChainInfo } from '@particle-network/chains';
	import { parseTokenId } from 'summit-utils';
	import { ccipRouterAbi } from '$lib/contracts/CCIPRouter/abi.js';
	import { getContext } from 'svelte';
	import type { ParticleConnect } from '@particle-network/connect';
	import { transactionToaster } from '$lib/utils.js';
	import { invalidateAll } from '$app/navigation';

	export let data;

	let showSupportModal = false;
	const { isConnected, client, provider, address: userAddress } = getUserStoreState();

	const particle: ParticleConnect = getContext('particle');

	async function makeCrossChain(walletClient: WalletClient) {
		// NOTE: only support for BNB
		const ccip = CCIP_TESTNET_CONTRACTS_INFO.bnb;

		const BNM_ADDRESS = ccip.tokens['CCIP-BnM'];

		const bnmContract = getContract({
			address: BNM_ADDRESS as `0x${string}`,
			abi: BNMABI,
			client: walletClient
		});

		const functionSelector = '0x97a657c9';

		const encodedData = encodeAbiParameters([{ name: 'gasLimit', type: 'uint' }], [BigInt(500000)]);

		const encodedExtraArgs = functionSelector + encodedData.slice(2);

		const { isPaying } = parseTokenId(BigInt($page.params.id));
		const price = isPaying ? BigInt(100) : BigInt(0);
		const tokenAmounts = isPaying ?[
			{
				token: ccip.tokens['CCIP-BnM'] as `0x${string}`,
				amount: price
			}
		]: [];

		const dataEncoded = encodeAbiParameters(
			[{ name: 'tokenId', type: 'uint256' }],
			[BigInt($page.params.id)]
		);

		const receiver = encodeAbiParameters(
			[{ name: 'receiver', type: 'address' }],
			[SUMMIT_RECEIVER_ADDRESS]
		);

		const message = {
			receiver: receiver,
			data: dataEncoded,
			tokenAmounts: tokenAmounts,
			feeToken: zeroAddress, // If fee token address is provided then fees must be paid in fee token.
			extraArgs: encodedExtraArgs
		};

		const chainSelector = CCIP_TESTNET_CONTRACTS_INFO.fuji.chain_selector;

		// NOTE: switch to bnb
		particle.switchChain(BNBChainTestnet);
		const txApproval = await bnmContract.write.approve(
			[ccip.router as `0x${string}`, price],
			// @ts-expect-error viem type hinting is unable to figure out the network hee
			{
				account: $userAddress! as `0x${string}`
			}
		);

		// get router contract
		let routerContract = getContract({
			abi: ccipRouterAbi,
			address: ccip.router as `0x${string}`,
			client: walletClient
		});

		const fees = await routerContract.read.getFee([chainSelector, message]);
		let tx = await routerContract.write.ccipSend([chainSelector, message], {
			value: fees,
			gas: BigInt(500000),
			account: $userAddress! as `0x${string}`
		});

		// NOTE: switch back to fuji
		particle.switchChain(AvalancheTestnet);

		return tx;
	}

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

		let txPromise = bnmContract.write.transferAndCall([
			SUMMIT_RECEIVER_ADDRESS as `0x${string}`,
			BigInt(0),
			bytesToHex(toBytes(BigInt($page.params.id)))
		]);

		return txPromise;
	}

	const promiser = async (chainInfo: ChainInfo) => {
		const walletClient = createWalletClient({
			chain: avalancheFuji,
			transport: custom($provider!)
		});
		await walletClient.switchChain({
			id: avalancheFuji.id
		});

		if (chainInfo.id === BNBChainTestnet.id) {
			const crossChainWalletClient = createWalletClient({
				chain: bscTestnet,
				transport: custom($provider!),
				account: $client?.account
			});
			return transactionToaster(makeCrossChain(crossChainWalletClient));
		}

		const bnmContract = getContract({
			address: BnM_TOKEN_ADDRESS,
			abi: BNMABI,
			client: walletClient
		});

		// NOTE: get mintprice if paying contract
		const summitContract = getContract({
			address: SUMMIT_ADDRESS,
			abi: summitABI,
			client: walletClient
		});

		const { isPaying } = parseTokenId(BigInt($page.params.id));
		const price = isPaying ? await summitContract.read.mintPrice() : BigInt(0);
		let txPromise = bnmContract.write.transferAndCall(
			[
				SUMMIT_RECEIVER_ADDRESS as `0x${string}`,
				price,
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

		toast.promise<Awaited<typeof txPromise>>(txPromise, {
			loading: 'Sending Transaction...',
			success: (hash) => {
				return 'Transaction successful! \n' + hash;
			},
			error: (err) => {
				console.error(err);
				return `Error: ${err}`;
			}
		});

		await txPromise;
		await invalidateAll();
	};

	$: preferedDisplayName = data.article.author?.name || data.article.author.address;
</script>

<div
	class="container max-w-4xl space-y-8 prose-sm prose dark:prose-invert prose-orange sm:prose-base lg:prose-xl prose-img:rounded-xl smoothscroll"
>
	<div class="">
		<img
			src={data.article.banner}
			alt={data.article.title}
			class="max-h-[300px] w-full rounded-xl object-cover object-center"
		/>
		<h1 class="mt-10">{data.article.title}</h1>
		<div class="flex flex-col justify-between gap-6 mt-6 not-prose lg:items-center xl:flex-row">
			<div class="flex items-center">
				<a
					href={APP_LINKS.USER_PROFILE(data.article.author.address)}
					class="flex items-center group"
				>
					<Avatar.Root class="border">
						<Avatar.Image src={data.article.author.avatar} alt={data.article.author.name} />
						<Avatar.Fallback
							>{(data.article.author?.name || data.article.author?.address)
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
		{#if !data.article.access}

		<div class="p-6 mb-8 text-center border">
			Support the author to get access
		</div>
		{/if}
		<SvelteMarkdown source={data.article.content} />
	</article>

	<div class="grid grid-cols-2 grid-rows-1 gap-8 not-prose">
		<SubscriptionCard name={preferedDisplayName}></SubscriptionCard>

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
				<Card.Description class="">Get a NFT when supporting the Author</Card.Description>
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
