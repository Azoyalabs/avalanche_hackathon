<script lang="ts">
	import { MountainSnow } from 'lucide-svelte';
	import '../../../../../app.pcss';
	export let image: string;
	export let title: string;

	export let author: string;
</script>

<!-- 
<div class="flex h-full overflow-hidden bg-black">
	<div class="flex flex-col w-full h-full p-8">
		<div class="flex w-24 h-24">
			<img alt="Nft" {src} class="object-cover w-full h-full" />
		</div>

		<div class="flex flex-col w-2/3 h-full text-white bg-black">
			<div class="flex flex-col px-4">
				<h1 class="text-3xl font-bold leading-tight text-pretty">
					{title}
				</h1>
				<div class="flex">
					<div class="flex">Author Name</div>
				</div>
			</div>
		</div>
	</div>
</div>
 -->
<div class="flex items-stretch h-full text-white bg-stone-900">
	<div class="flex flex-col justify-between w-2/5 p-6">
		<div class="flex flex-col">
			<div class="flex text-pretty text-2xl font-bold leading-[1.10]">
				{title}
			</div>

			<div class="flex mt-6 font-normal break-all whitespace-nowrap">{author}</div>
		</div>

		<div class="flex flex-col">
			<MountainSnow class='w-8 h-8' />
			<div class="flex mt-1">Summit</div>
		</div>
	</div>

	<div class="flex w-3/5 h-full" style="background-image: url({image});">
		<!-- <img {src} class="w-full h-full" />  -->
	</div>
	<!-- <img {src} class="w-3/5 h-full" /> -->
</div>
