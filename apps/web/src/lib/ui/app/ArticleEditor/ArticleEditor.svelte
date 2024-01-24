<script lang="ts">
	import EasyMDE from 'easymde';
	import 'easymde/dist/easymde.min.css';
	import { onMount } from 'svelte';
	const id = crypto.randomUUID();

	onMount(() => {
		const easyMDE = new EasyMDE({ element: document.getElementById(id)!, minHeight: '400px' });

		return () => easyMDE.cleanup();
	});
</script>

<textarea {id} class="border border-red-500 font-nunito"></textarea>

<style>
</style>
