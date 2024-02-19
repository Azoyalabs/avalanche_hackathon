<script lang="ts">
	import * as Avatar from '$lib/ui/shadcn/ui/avatar';

	export let article: {
		title: string;
		publishDate: Date;
		preview: string;
		author: {
			name: string;
			avatar: string;
		};
		description: string;
		url: string;
		banner: string;
	};
</script>

<a
	class="@container hover:border-foreground/40 group block w-full overflow-hidden rounded-xl border duration-300"
	href={article.url}
>
	<div class="@lg:flex h-full gap-2">
		<img
			src={article.banner}
			alt={article.title}
			class="@xl:h-60 @xl:w-52 @2xl:w-2/5 h-40 w-full object-cover"
		/>
		<div class="w-full p-4">
			<h4 class="text-xl font-bold">{article.title}</h4>
			<p class="mt-2 text-xs text-muted-foreground">
				Published {article.publishDate.toLocaleString()}
			</p>

			<div
				class="text-muted-foreground @xl:max-h-none relative h-24 overflow-y-hidden pt-6 text-sm"
			>
				{article.description}
				<!-- 
				<div
					class="@xl:hidden from-background/0 via-background-00 to-background/60 absolute inset-0 bg-gradient-to-b"
				></div>
				 -->
			</div>

			<div class="flex items-center justify-end mt-2">
				<span class="mr-2">
					{article.author.name.substring(0, 8)}...{article.author.name.substring(
						article.author.name.length - 8
					)}
				</span>
				<!-- 
				<Avatar.Root class="border">
					<Avatar.Image src={article.author.avatar} alt={article.author.name} />
					<Avatar.Fallback
						>{article.author.name
							.split(' ')
							.map((chars) => chars[0])
							.join()}</Avatar.Fallback
					>
				</Avatar.Root>
				 -->
			</div>
		</div>
	</div>
</a>
