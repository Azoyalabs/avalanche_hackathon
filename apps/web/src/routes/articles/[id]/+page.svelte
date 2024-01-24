<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';
	import { Separator } from '$lib/ui/shadcn/ui/separator';
	import { Button, buttonVariants } from '$lib/ui/shadcn/ui/button';
	import * as Dialog from '$lib/ui/shadcn/ui/dialog';
	import * as Card from '$lib/ui/shadcn/ui/card';
	
	import * as Avatar from '$lib/ui/shadcn/ui/avatar';
	import SubscriptionCard from '$lib/ui/app/SubscriptionCard/SubscriptionCard.svelte';

	export let data;
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
				<Avatar.Root class="border">
					<Avatar.Image src={data.article.author.avatar} alt={data.article.author.name} />
					<Avatar.Fallback
						>{data.article.author.name
							.split(' ')
							.map((chars) => chars[0])
							.join()}
					</Avatar.Fallback>
				</Avatar.Root>
				<span class="ml-2 text-muted-foreground">
					{data.article.author.name}
				</span>
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
				<Dialog.Root>
					<Dialog.Trigger class={buttonVariants({ variant: 'default', size: 'sm' })}
						>Support</Dialog.Trigger
					>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
							<Dialog.Description>
								This action cannot be undone. This will permanently delete your account and remove
								your data from our servers.
							</Dialog.Description>
						</Dialog.Header>
					</Dialog.Content>
				</Dialog.Root>
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
				<Card.Title>
					Verification
				</Card.Title>
				<Card.Description>
					whatever info we want here
				</Card.Description>
			</Card.Header>
			<Card.Content class="">

			</Card.Content>
			<Card.Footer>
				<div>
					user address, nft address, token ID
				</div>
			</Card.Footer>
		</Card.Root>

		<Card.Root class="">
			<Card.Header>
				<Card.Title>
					Show your support
				</Card.Title>
				<Card.Description class="">
					<div>
						tip and get NFT

					</div>
				</Card.Description>
			</Card.Header>
			<Card.Content class="">
				
				<div>
					how many supported already
				</div>
				<div>
					support button
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</div>
