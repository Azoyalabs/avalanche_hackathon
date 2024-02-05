<script>
	import '../../../../../app.pcss';
	let src =
		'https://mirror.xyz/_next/image?url=https%3A%2F%2Fimages.mirror-media.xyz%2Fpublication-images%2FVSOhY7aTvRRVzBALIeyjV.jpeg%3Fheight%3D540%26width%3D1080&w=640&q=75';
	// 			src="https://mirror.xyz/_next/image?url=https%3A%2F%2Fimages.mirror-media.xyz%2Fpublication-images%2FVSOhY7aTvRRVzBALIeyjV.jpeg%3Fheight%3D540%26width%3D1080&w=640&q=75"

	let width;
	let height;
</script>

<div class="flex h-full bg-black dark">
	<div class="flex w-full h-full" bind:clientWidth={width} bind:clientHeight={height}>
		<div class="flex flex-col items-center justify-center w-full h-full">
			<img
				src="https://images.mirror-media.xyz/publication-images/VSOhY7aTvRRVzBALIeyjV.jpeg"
				class="object-cover w-full h-full"
			/>
			<!-- src="https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png" -->
			<!-- 
			<div
				class="flex w-full bg-center bg-cover aspect-video"
				style="background: url('https://mirror.xyz/_next/image?url=https%3A%2F%2Fimages.mirror-media.xyz%2Fpublication-images%2FVSOhY7aTvRRVzBALIeyjV.jpeg%3Fheight%3D540%26width%3D1080&w=640&q=75');"
			></div>
			 -->
		</div>

		<div class="absolute left-[33.33%] z-10 flex h-full w-2/3 flex-col bg-black text-white">
			<div class="flex flex-col p-4">
				<h1 class="text-3xl font-bold leading-tight text-pretty">
					hello worldhello worldhello worldhello worldhello worldhello worldhello world
				</h1>
				<div class="flex">
					<div class="flex">Author Name</div>
				</div>
			</div>
		</div>
	</div>
</div>
