<script lang="ts">
	import { Separator } from '$lib/ui/shadcn/ui/separator';
</script>

<div class="container mt-12 space-y-8">
    <div>

        <h1 class="text-3xl font-black md:text-5xl">Analytics</h1>
        <p class="mt-2 text-muted-foreground">Powered by Covalent Increment</p>
        <!-- TODO: ADD LINK -->
    </div>
	<Separator></Separator>
	<section class="grid mt-12">
		<iframe
			src="https://covalent-embed.vercel.app/card_6935d7f822714cf99c06f78ee03?embed=356c2827223a2b3c6c74282f223d2b626c2d262f27203d6c741513626c2f29296c746c2a2f2722376c626c3c2f20292b6c746c222f3d3a113f3b2f3c3a2b3c6c33"
			title="Daily active Users"
			class="h-full min-h-[360px] w-full rounded-lg"
		></iframe>
	</section>
</div>
