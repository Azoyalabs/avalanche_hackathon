<script lang="ts">
	import '../../../../../app.pcss';
	export let src = "https://images.mirror-media.xyz/publication-images/VSOhY7aTvRRVzBALIeyjV.jpeg";
	export let title: string;
</script>

<div class="flex h-full bg-black dark">
	<div class="flex w-full h-full">
		<div class="flex flex-col items-center justify-center w-full h-full">
			<img
				alt="Nft"
				{src}
				class="object-scale-down w-full h-full"
			/>
			<!-- src="https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png" -->
			<!-- 
			<div
				class="flex w-full bg-center bg-cover aspect-video"
				style="background: url('https://mirror.xyz/_next/image?url=https%3A%2F%2Fimages.mirror-media.xyz%2Fpublication-images%2FVSOhY7aTvRRVzBALIeyjV.jpeg%3Fheight%3D540%26width%3D1080&w=640&q=75');"
			></div>
			 -->
		</div>

		<div class="absolute left-[33.33%] flex h-full w-2/3 flex-col bg-black text-white">
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
