<script lang="ts">
	import Button from '$lib/ui/shadcn/ui/button/button.svelte';
	import { createEventDispatcher } from 'svelte';
	import { cn } from '$lib/utils';
	import type { Button as ButtonPrimitive } from 'bits-ui';

	type Events = ButtonPrimitive.Events;
	type $$Events = Events;

	const dispatch = createEventDispatcher<Events>();

	let feedback: boolean = false;
	let className: string | undefined = undefined;
	export { className as class };
</script>

<Button
	class={cn('bg-background disabled:opacity-100', className)}
	variant="ghost"
	disabled={feedback}
	size="icon"
	on:click={(e) => {
		feedback = true;
		setTimeout(() => {
			feedback = false;
		}, 1500);
		dispatch('click', e);
	}}
>
	<slot {feedback} />
</Button>
