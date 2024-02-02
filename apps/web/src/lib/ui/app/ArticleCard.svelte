<script lang="ts">
	import { APP_LINKS } from '$lib/links';
	import * as Avatar from '$lib/ui/shadcn/ui/avatar';

	// FIXME: we need an article ID or a slug
	export let article: {
		title: string;
		publishDate: Date;
		preview: string;
		author: {
			name: string;
			avatar: string;
		};
	};
</script>

<a
	class="@container hover:border-foreground/40 group block w-full overflow-hidden rounded-xl border duration-300"
	href={APP_LINKS.ARTICLE('hey')}
>
	<div class="@lg:flex h-full gap-2">
		<img
			src="https://mirror.xyz/_next/image?url=https%3A%2F%2Fimages.mirror-media.xyz%2Fpublication-images%2FVSOhY7aTvRRVzBALIeyjV.jpeg%3Fheight%3D540%26width%3D1080&w=640&q=75"
			alt={article.title}
			class="@xl:h-60 @xl:w-52 @2xl:w-2/5 h-40 w-full object-cover"
		/>
		<div class="p-4">
			<h4 class="text-xl font-bold">{article.title}</h4>
			<p class="text-xs">published: {article.publishDate.toDateString()}</p>

			<div class="flex items-center">
				<Avatar.Root class="border">
					<Avatar.Image src={article.author.avatar} alt={article.author.name} />
					<Avatar.Fallback
						>{article.author.name
							.split(' ')
							.map((chars) => chars[0])
							.join()}</Avatar.Fallback
					>
				</Avatar.Root>

				<span class="ml-2">
					{article.author.name}
				</span>
			</div>

			<div class="relative pt-6 overflow-y-hidden text-sm text-muted-foreground max-h-24 @xl:max-h-none">
				{article.preview}

				<div
					class="@xl:hidden from-background/0 via-background-00 to-background/60 absolute inset-0 bg-gradient-to-b"
				></div>
			</div>
		</div>
	</div>
</a>
