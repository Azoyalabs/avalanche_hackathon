<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/ui/shadcn/ui/button';
	import { ArrowUpRight } from 'lucide-svelte';
</script>

<div class="flex flex-col items-center justify-center flex-grow min-h-screen space-y-6">
	<h1 class="text-5xl font-bold">{$page.error?.message || 'Something went wrong'}</h1>
	<Button variant="outline" class="space-x-1" href="/">
		<span>Go Back Home</span>

		<ArrowUpRight class="text-muted-foreground" size="18"></ArrowUpRight>
	</Button>
</div>
