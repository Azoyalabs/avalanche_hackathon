<script lang="ts">
	import { getFormField } from 'formsnap';
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	// import type { TextareaGetFormField } from ".";
	import { Textarea, type TextareaEvents } from '$lib/ui/shadcn/ui/textarea';
	import type { TextareaGetFormField } from '$lib/ui/shadcn/ui/form';
	import { onMount, onDestroy } from 'svelte';
	import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';

	type $$Props = HTMLTextareaAttributes;
	type $$Events = TextareaEvents;

	const { attrStore, value } = getFormField() as TextareaGetFormField;

	let editor: Monaco.editor.IStandaloneCodeEditor;
	let editorContainer: HTMLElement;
/*
	let monaco: typeof Monaco;
	onMount(async () => {
		monaco = (await import('./monaco')).default;
		const editor = monaco.editor.create(editorContainer, {
			theme: 'vs-dark'
		});
		const model = monaco.editor.createModel('## Hello from summit', 'markdown');
		editor.setModel(model);
	});

	onDestroy(() => {
		monaco?.editor.getModels().forEach((model) => model.dispose());
		editor?.dispose();
	});*/
</script>

<Textarea
	bind:this={editorContainer}
	{...$attrStore}
	bind:value={$value}
	{...$$restProps}
	on:blur
	on:change
	on:click
	on:focus
	on:keydown
	on:keypress
	on:keyup
	on:mouseover
	on:mouseenter
	on:mouseleave
	on:paste
	on:input
	class="min-h-[300px]"
/>
