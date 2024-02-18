<script lang="ts">
	import { Button } from '$lib/ui/shadcn/ui/button';
	import { Separator } from '$lib/ui/shadcn/ui/separator';
</script>

<div class="container mt-12 space-y-8">
	<div class="flex flex-col justify-between gap-4 md:flex-row md:items-center">
		<div>
			<h1 class="text-3xl font-black md:text-5xl">Analytics</h1>
			<p class="mt-2 text-muted-foreground">Powered by Covalent Increment</p>
		</div>
		<Button
			href="https://www.covalenthq.com/docs/increment/"
			variant="outline"
			class="w-full md:w-auto">Learn More</Button
		>
	</div>
	<Separator></Separator>
	<section class="grid grid-cols-1 grid-rows-2 gap-6 mt-12 md:grid-cols-2 lg:grid-cols-3">
		<iframe
			src="https://covalent-embed.vercel.app/card_6935d7f822714cf99c06f78ee03?embed=356c2827223a2b3c6c74282f223d2b626c2d262f27203d6c741513626c2f29296c746c2a2f2722376c626c3c2f20292b6c746c222f3d3a113f3b2f3c3a2b3c6c33"
			title="Daily active Users"
			class="w-full h-full col-span-3 rounded-lg min-h-[300px]"
		></iframe>

		<iframe
			src="https://covalent-embed.vercel.app/card_b1bdedce502346418f5337a2767?embed=356c2827223a2b3c6c74282f223d2b626c2d262f27203d6c741513626c2f29296c746c2a2f2722376c626c3c2f20292b6c746c222f3d3a113f3b2f3c3a2b3c6c33"
			title="Transaction Count"
			class="w-full h-full rounded-lg"
		></iframe>

		<iframe
			src="https://covalent-embed.vercel.app/card_ed4592d5b3534c9599178be6618?embed=356c2827223a2b3c6c74282f223d2b626c2d262f27203d6c741513626c2f29296c746c2a2f2722376c626c3c2f20292b6c746c222f3d3a113f3b2f3c3a2b3c6c33"
			title="Total spent to back writers"
			class="w-full h-full rounded-lg"
		></iframe>
	</section>
</div>
