<script lang="ts">
	import { AccessStatus } from '$lib/types/access';
	import PublishForm from '$lib/ui/app/PublishForm/PublishForm.svelte';
	import type { ActionData } from './$types.js';

	export let data;

	$: summitClient = (() => {})();

	export let form: ActionData;

	// TODO: we need to react to the form and it's articleID in order to prompt the actual tx
	// Since we have the article ID, we can redirect on success without an issue
</script>

{#if data.access === AccessStatus.Unknown}
	<!-- TODO: user needs to connect and request approval.  -->

	<div>Request access to write</div>
{:else if data.access === AccessStatus.Banned}
	<!-- TODO: redesign  -->
	<div>You're banned</div>
{:else}
	{form?.articleID}

	<PublishForm form={data.form}></PublishForm>
{/if}
