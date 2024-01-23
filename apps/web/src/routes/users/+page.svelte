<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/ui/shadcn/ui/card';
	import * as Avatar from '$lib/ui/shadcn/ui/avatar';
	import { Button } from '$lib/ui/shadcn/ui/button';

	export let data: PageData;
</script>

<div class="container pt-12 space-y-6">
	<h1 class="text-5xl font-black">Users</h1>
	<div class="grid grid-cols-3 gap-6">
		{#each new Array(10)
			.fill(0)
			.map( (_) => ({ name: 'user name', avatar: 'https://miro.medium.com/v2/resize:fill:24:24/1*OkvxzWk0qB6UnnGRo-aDAQ.png', published: 23 }) ) as author}
			<Card.Root class="rounded-xl">
				<Card.Header>
					<Card.Title class="flex items-center space-x-3">
						<Avatar.Root class="border-2">
							<Avatar.Image src={author.avatar} alt={author.name} />
							<Avatar.Fallback
								>{author.name
									.split(' ')
									.map((chars) => chars[0].toUpperCase())
									.join('')}
							</Avatar.Fallback>
						</Avatar.Root>
						<span class="text-lg">{author.name}</span>
					</Card.Title>
				</Card.Header>
				<Card.Content class="flex items-center justify-between">
					<div>x followers, x articles, x minted or something</div>
				</Card.Content>
				<Card.Footer class="flex justify-end">
					<Button variant="outline" size="sm">View Articles</Button>
				</Card.Footer>
			</Card.Root>
		{/each}
	</div>
</div>
