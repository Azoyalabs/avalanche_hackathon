<script lang="ts">
	import { Button } from '$lib/ui/shadcn/ui/button';
	import { Copy } from 'lucide-svelte';
	import { LayoutLink, setLayoutContext } from '../context';
	import * as Card from '$lib/ui/shadcn/ui/card';

	setLayoutContext(LayoutLink.Profile);
</script>

<div class="grid gap-6 md:grid-cols-2">
	<Card.Root>
		<Card.Header>
			<Card.Title>Your rewards</Card.Title>
			<Card.Description>description</Card.Description>
		</Card.Header>

		<Card.Content>
			<div>rewards amount</div>
		</Card.Content>
		<Card.Footer>
			<Button>Claim Rewards</Button>
		</Card.Footer>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>Referral Link</Card.Title>
			<Card.Description>description</Card.Description>
		</Card.Header>

		<Card.Content>
			<div class="py-2 border rounded-md">
				https://mirror.xyz/dashboard/project/0x193736bBCe424234a8A2cc785Efe8842C74829a7/join
				<Button variant="ghost">
					<Copy />
				</Button>
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>Profile Link</Card.Title>
			<Card.Description>description</Card.Description>
		</Card.Header>

		<Card.Content>
			<div class="py-2 border rounded-md">
				https://mirror.xyz/dashboard/project/0x193736bBCe424234a8A2cc785Efe8842C74829a7/join
				<Button variant="ghost">
					<Copy />
				</Button>
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>Settings</Card.Title>
			<Card.Description>settings description</Card.Description>
		</Card.Header>

		<Card.Content>
			<div>
				<div>night / day mode</div>
			</div>
		</Card.Content>
	</Card.Root>
</div>
