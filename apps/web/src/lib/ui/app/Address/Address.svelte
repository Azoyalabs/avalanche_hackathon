<script lang="ts">
	export let address: string;
	const pre = address.substring(0, 5);
	const post = address.substring(address.length - 4);
</script>

{pre}...{post}
