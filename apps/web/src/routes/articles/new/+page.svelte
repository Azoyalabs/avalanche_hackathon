<script lang="ts">
	import { Button } from '$lib/ui/shadcn/ui/button';
	import { Input } from '$lib/ui/shadcn/ui/input';
	import { Label } from '$lib/ui/shadcn/ui/label';

	import 'easymde/dist/easymde.min.css';
	import { Notebook, Upload } from 'lucide-svelte';
	import { onDestroy, onMount } from 'svelte';
	import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';

	let editor: Monaco.editor.IStandaloneCodeEditor;
	let monaco: typeof Monaco;
	let editorContainer: HTMLElement;

	onMount(async () => {
		// Import our 'monaco.ts' file here
		// (onMount() will only be executed in the browser, which is what we want)
		monaco = (await import('./monaco')).default;

		// Your monaco instance is ready, let's display some code!
		const editor = monaco.editor.create(editorContainer, {
			theme: 'vs-dark'
		});
		const model = monaco.editor.createModel('# Hello from summit', 'markdown');
		editor.setModel(model);
	});

	onDestroy(() => {
		monaco?.editor.getModels().forEach((model) => model.dispose());
		editor?.dispose();
	});

	const id = crypto.randomUUID();
	/*
	onMount(() => {
		return;
		async function initEasyMDE() {
			const EasyMDE = (await import('easymde')).default;
			const easyMDE = new EasyMDE({ element: document.getElementById(id)!, minHeight: '400px' });

			return () => easyMDE.cleanup();
		}

		const cleanup = initEasyMDE();

		//return () => easyMDE.cleanup();
		return cleanup;
	});*/

	export let contractFileList: FileList | null = null;

	$: contractFile = contractFileList ? contractFileList.item(0) : null;

	$: fileName = contractFile?.name;
	$: fileSize = contractFile?.size;
</script>

<div class="pt-12 space-y-6">
	<div class="flex flex-col w-full gap-2">
		<Label for="title">Title</Label>
		<Input type="text" id="title" placeholder="Article Title" />
		<p class="text-sm text-muted-foreground">Enter the title of your article.</p>
	</div>

	<div class="flex flex-col gap-2">
		<Label for="dropzone-file">Header Image</Label>

		<div class="flex items-center justify-center w-full">
			<label
				for="dropzone-file"
				class="flex flex-col items-center justify-center w-full h-64 duration-200 rounded-lg cursor-pointer bg-muted hover:bg-muted-foreground/30 group"
			>
				<div class="flex flex-col items-center justify-center pt-5 pb-6">
					{#if contractFile}
						<Notebook size={30} class="text-muted-foreground group-hover:text-foreground" />
					{:else}
						<Upload size={30} class="text-muted-foreground group-hover:text-foreground" />
					{/if}
					{#if contractFile}
						<p class="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
							<span class="font-semibold">{fileName}</span>
						</p>
						<p class="text-sm text-neutral-500 dark:text-neutral-400">
							{((fileSize ?? 0) / 1000).toFixed(0)} kB
						</p>
					{:else}
						<p class="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
							<span class="font-semibold">{'Click to upload'}</span>
						</p>
						<p class="text-sm text-neutral-500 dark:text-neutral-400">
							{'your file'}
						</p>
					{/if}
				</div>
				<input
					id="dropzone-file"
					type="file"
					accept=".png,.jpg,.jpeg"
					class="hidden"
					bind:files={contractFileList}
				/>
			</label>
		</div>
	</div>

	<div class="flex flex-col w-full gap-2">
		<div class="flex items-center justify-between">
			<Label for="editor">Content</Label>
			<div class="text-xs">
				This editor uses Markdown (link)
			</div>
		</div>

		<div
			id="editor"
			bind:this={editorContainer}
			class="dark h-[600px] w-full rounded-md border"
		></div>
	</div>

	<!-- 
	<div class="flex flex-col w-full gap-2">
		<Label for={id}>Content</Label>

		<textarea {id} class="border border-red-500 font-nunito"></textarea>
	</div>
	 -->

	<div class="flex flex-col w-full max-w-sm gap-2">
		<Label for={id}>Price</Label>

		<div>je sais pas trop comment faire là gratuit / pas gratuit / prix</div>
	</div>

	<div>
		<Button>Publish</Button>
	</div>
</div>
