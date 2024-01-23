<script context="module" lang="ts">
	import ArticleEditor from './ArticleEditor.svelte';

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	export const meta = {
		title: 'Article',
		component: ArticleEditor,
		tags: ['autodocs'],
		argTypes: {},
		args: {}
	} satisfies Meta<ArticleEditor>;
	//export default meta;
</script>

<script lang="ts">
	import { Story, Template } from '@storybook/addon-svelte-csf';

	import type { Meta, StoryObj } from '@storybook/svelte';

	type Story = StoryObj<typeof meta>;
	/*
// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    label: 'To Review',
    value: 245
  },
};
*/
</script>

<Template let:args>
	<ArticleEditor {...args}></ArticleEditor>
</Template>

<Story name="Empty">
	<ArticleEditor></ArticleEditor>
</Story>
