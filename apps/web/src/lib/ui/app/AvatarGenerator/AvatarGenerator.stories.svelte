<script context="module" lang="ts">
	import AvatarGenerator from './AvatarGenerator.svelte';

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	export const meta = {
		title: 'Avatar',
		component: AvatarGenerator,
		tags: ['autodocs'],
		argTypes: {},
		args: {}
	} satisfies Meta<AvatarGenerator>;
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
	<AvatarGenerator {...args}></AvatarGenerator>
</Template>

<Story name="Rounded">
	<div class="w-20 h-20">
		<AvatarGenerator
			props={{
				name: 'archway18m26lkjly2hkck25t7sdsrnu72x0g6gxdxxr4q',
				colors: ['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90'],
				square: false
			}}
		></AvatarGenerator>
	</div>
</Story>
