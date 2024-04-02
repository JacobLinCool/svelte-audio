<script lang="ts">
	import { Audio } from "$lib/index.js";
	import { playlist } from "../playlist.js";

	let paused = false;
	let time = 0;
	let volume = 1;
	let mini = false;
</script>

<Audio bind:paused bind:time bind:volume bind:mini {playlist}>
	<!-- Loading Slot -->
	<div>Loading ...</div>
</Audio>

Paused: <input type="checkbox" bind:checked={paused} />
Volume: <input type="range" min="0" max="1" step="0.01" bind:value={volume} />
Mini: <input type="checkbox" bind:checked={mini} />
Current Time: {time}s
