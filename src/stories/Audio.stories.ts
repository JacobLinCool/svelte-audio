import Audio from "$lib/components/Audio.svelte";
import type { Meta, StoryObj } from "@storybook/svelte";
import { playlist } from "../playlist.js";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
	title: "Audio",
	component: Audio,
	tags: ["autodocs"],
	argTypes: {
		loop: {
			control: { type: "select" },
			options: ["all", "one", "none"],
		},
		order: {
			control: { type: "select" },
			options: ["list", "random"],
		},
		preload: {
			control: { type: "select" },
			options: ["auto", "metadata", "none"],
		},
		volume: {
			control: { type: "range", value: 1.0, min: 0, max: 1, step: 0.01 },
		},
	},
} satisfies Meta<Audio>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Normal: Story = {
	args: {
		playlist,
	},
};

export const Mini: Story = {
	args: {
		playlist,
		mini: true,
	},
};
