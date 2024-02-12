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
	import { WALLET_CLIENT, getUserStoreState } from '$lib/state.js';
	import { bytesToHex, createWalletClient, custom, getContract, toBytes, toHex } from 'viem';
	import { avalancheFuji, bscTestnet } from 'viem/chains';
	import { BnM_TOKEN_ADDRESS, SUMMIT_ADDRESS, SUMMIT_RECEIVER_ADDRESS } from '$lib/constants.js';
	import { abi as summitABI } from '$lib/contracts/summit/abi.js';
	import { abi as BNMABI } from '$lib/contracts/ERC20/abi.js';
	import { page } from '$app/stores';
	import { BNBChainTestnet } from '@particle-network/chains';

	export let data;

	let showSupportModal = false;
	const { isConnected, client, provider, address: userAddress } = getUserStoreState();

	const promiser = async () => {
		const walletClient = createWalletClient({
			//chain: avalancheFuji,
			chain: bscTestnet,
			transport: custom($provider!)
		});
		$provider!.request({
			
		})

		await walletClient.switchChain({
			id: avalancheFuji.id
		})
		

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

		//console.log(bytesToHex(toBytes($page.params.id)));
		console.log(toHex($page.params.id))
		const result = await bnmContract.simulate.transferAndCall(
			[SUMMIT_RECEIVER_ADDRESS as `0x${string}`, BigInt(0), bytesToHex(toBytes(BigInt($page.params.id)))],
			{
				account: $userAddress! as `0x${string}`
			}
		);
		console.log(`calculated gas: ${result}`)
		

		let txPromise = bnmContract.write.transferAndCall(
			[SUMMIT_RECEIVER_ADDRESS as `0x${string}`, BigInt(0), bytesToHex(toBytes(BigInt($page.params.id)))],
			{
				account: $userAddress! as `0x${string}`,
			}
		);

		return toast.promise<Awaited<typeof txPromise>>(txPromise, {
			loading: 'Loading...',
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
	class="container max-w-4xl space-y-8 prose-sm prose dark:prose-invert prose-orange sm:prose-base lg:prose-xl prose-img:rounded-xl"
>
	<div class="">
		<img
			src="https://images.mirror-media.xyz/publication-images/yClkyV3zTvmXOt1cvcksN.png?height=596&amp;width=1192"
			alt={data.article.title}
			class="rounded-xl"
		/>
		<h1 class="mt-10">The State of Expansive Communities on Farcaster</h1>
		<div class="flex items-center justify-between mt-6 not-prose">
			<div class="flex items-center">
				<a href={APP_LINKS.USER_PROFILE(data.article.author.name)} class="flex items-center group">
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
						{data.article.author.name}
					</span>
				</a>
			</div>
			<div class="flex items-center space-x-3">
				<div class="flex items-center">
					<!-- We want to stagger avatars here -->
					{#each data.article.minters as supporter}
						<Avatar.Root class="w-8 h-8 border-2">
							<Avatar.Image src={supporter.avatar} alt={supporter.name} />
							<Avatar.Fallback
								>{data.article.author.avatar
									.split(' ')
									.map((chars) => chars[0])
									.join()}
							</Avatar.Fallback>
						</Avatar.Root>
					{/each}
				</div>
				{#if $isConnected}
					<Dialog.Root bind:open={showSupportModal}>
						<Dialog.Trigger class={buttonVariants({ variant: 'default', size: 'sm' })}>
							Support
						</Dialog.Trigger>
						<SupportModal
							on:click={() => {
								showSupportModal = false;
								promiser();
							}}
						></SupportModal>
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

	<div class="grid grid-cols-2 gap-8 not-prose">
		<SubscriptionCard name={data.article.author.name}></SubscriptionCard>

		<Card.Root class="">
			<Card.Header>
				<Card.Title>Verification</Card.Title>
				<Card.Description>whatever info we want here</Card.Description>
			</Card.Header>
			<Card.Content class=""></Card.Content>
			<Card.Footer>
				<div>user address, nft address, token ID</div>
			</Card.Footer>
		</Card.Root>

		<Card.Root class="">
			<Card.Header>
				<Card.Title>Show your support</Card.Title>
				<Card.Description class="">
					<div>tip and get NFT</div>
				</Card.Description>
			</Card.Header>
			<Card.Content class="">
				<div>how many supported already</div>
				<div>support button</div>
			</Card.Content>
		</Card.Root>
	</div>
</div>
