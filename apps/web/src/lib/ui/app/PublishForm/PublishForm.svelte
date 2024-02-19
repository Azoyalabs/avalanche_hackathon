<script lang="ts">
	import * as Form from '$lib/ui/shadcn/ui/form';
	import { Button } from '$lib/ui/shadcn/ui/button';

	import { publishSchema, type PublishSchema } from '$lib/schemas/PublishSchema';
	import type { SuperValidated } from 'sveltekit-superforms';

	import MonacoField from './MonacoField.svelte';
	export let form: SuperValidated<PublishSchema>;
</script>

<Form.Root
	method="POST"
	{form}
	schema={publishSchema}
	let:config
	enctype="multipart/form-data"
	class="space-y-6"
>
	<Form.Field {config} name="title">
		<Form.Item>
			<Form.Label>Title</Form.Label>
			<Form.Input />
			<Form.Description>This is your Article's title.</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Field {config} name="description">
		<Form.Item>
			<Form.Label>Description</Form.Label>
			<Form.Textarea class="resize-none" />
			<Form.Description>A short preview of your article</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<Form.Field {config} name="image">
		<Form.Item>
			<Form.Label>Image</Form.Label>
			<Form.Input type="file" name="image" accept="image/png, image/jpeg" />
			<Form.Description>This is your Article's header image.</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="content">
		<div class="flex flex-col w-full gap-2">
			<div class="flex items-center justify-between">
				<Form.Label>Content</Form.Label>
				<div class="text-xs">
					This editor uses <Button
						href="https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax"
						variant="link"
						class="inline px-0 text-sm text-inherit"
						>Markdown
					</Button>
				</div>
			</div>

			<MonacoField></MonacoField>
		</div>
	</Form.Field>

	<Form.Field {config} name="free">
		<div class="flex flex-row items-center justify-between p-4 border rounded-lg">
			<div class="space-y-0.5">
				<Form.Label>Free</Form.Label>
				<div class="text-muted-foreground">Let anyone read your article for free</div>
				<div class="text-xs"> 0.{"100".padStart(18, "0")} BnM otherwise</div>
			</div>
			<Form.Switch />
		</div>
	</Form.Field>
	<Form.Button>Publish</Form.Button>
</Form.Root>
