<script context="module" lang="ts">
	import SupportModal from './SupportModal.svelte';
	import * as Dialog from '$lib/ui/shadcn/ui/dialog';

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	export const meta = {
		title: 'SupportModal',
		component: SupportModal,
		tags: ['autodocs'],
		argTypes: {},
		args: {}
	} satisfies Meta<SupportModal>;

	let open = writable(true);
	//export default meta;
</script>

<script lang="ts">
	import { Story, Template } from '@storybook/addon-svelte-csf';

	import type { Meta, StoryObj } from '@storybook/svelte';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';

	type Story = StoryObj<typeof meta>;

    onMount(() => {
        $open = true
    })
</script>

<Template let:args>
	<SupportModal {...args}></SupportModal>
</Template>

<Story name="Free">
	<Dialog.Root bind:open={$open}>
		<SupportModal on:click={() => ($open = false)}></SupportModal>
	</Dialog.Root>
</Story>

<Story name="Paid">
	<Dialog.Root bind:open={$open}>
		<SupportModal></SupportModal>
	</Dialog.Root>
</Story>
