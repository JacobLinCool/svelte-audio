<script lang="ts">
	import "aplayer/dist/APlayer.min.css";
	import { onDestroy, onMount, createEventDispatcher } from "svelte";
	import type { PlayerEvent, PlayerOption } from "$lib/types.js";
	import { events } from "$lib/constants.js";

	const dispatch = createEventDispatcher<PlayerEvent>();

	export let fixed: PlayerOption["fixed"] = false;
	export let mini: PlayerOption["mini"] = false;
	export let autoplay: PlayerOption["autoplay"] = false;
	export let theme: PlayerOption["theme"] = "#b7daff";
	export let loop: PlayerOption["loop"] = "all";
	export let order: PlayerOption["order"] = "list";
	export let preload: PlayerOption["preload"] = "auto";
	export let volume: PlayerOption["volume"] = 1.0;
	export let mutex: PlayerOption["mutex"] = true;
	export let listFolded: PlayerOption["listFolded"] = false;
	export let storageName: PlayerOption["storageName"] = "svelte-audio-setting";
	export let playlist: PlayerOption["audio"];
	export let listMaxHeight: PlayerOption["listMaxHeight"] = undefined;
	export let customAudioType: PlayerOption["customAudioType"] = undefined;

	export let paused = false;
	export let time = 0;

	let ap: any;
	let target: HTMLElement;
	let nativeAudio: HTMLAudioElement;
	let ready = playlist.length === 0;

	onMount(() => {
		init(target);
	});

	onDestroy(() => {
		if (ap) {
			ap.destroy();
		}
	});

	async function init(container: HTMLElement) {
		// @ts-expect-error no types available
		const { default: APlayer } = await import("aplayer");

		let lrc = playlist.filter((item) => item.lrc !== undefined).length;
		if (lrc !== 0 && lrc !== playlist.length) {
			throw new Error("All or none of the playlist items must have lrc");
		}
		let embeddedLrc = playlist.filter((item) => typeof item.lrc === "string").length;
		if (embeddedLrc && embeddedLrc !== lrc) {
			throw new Error("Cannot mix embedded and external lrc");
		}

		const audio = playlist.map((item) => {
			return {
				name: item.name,
				artist: item.artist,
				url: item.url.toString(),
				cover: item.cover?.toString(),
				lrc: item.lrc?.toString(),
				theme: item.theme,
				type: item.type,
			};
		});

		ap = new APlayer({
			container,
			fixed,
			mini,
			autoplay,
			theme,
			loop,
			order,
			preload,
			volume,
			mutex,
			listFolded,
			storageName,
			audio,
			listMaxHeight,
			customAudioType,
			lrcType: lrc ? (embeddedLrc ? 1 : 3) : 0,
		});

		for (const event of events) {
			ap.on(event, (...args: never[]) => {
				dispatch(event, ...args);
			});
		}

		ap.on("loadedmetadata", () => {
			ready = true;
		});

		nativeAudio = ap.audio;
		nativeAudio.addEventListener("timeupdate", () => {
			time = nativeAudio.currentTime;
		});
		nativeAudio.addEventListener("pause", () => {
			paused = true;
		});
		nativeAudio.addEventListener("play", () => {
			paused = false;
		});

		paused = !autoplay;
	}

	$: {
		if (ap) {
			ap.setMode(mini ? "mini" : "normal");
		}
	}

	$: {
		if (ap) {
			ap.volume(volume, true);
		}
	}

	$: {
		if (ap) {
			if (paused && !nativeAudio.paused) {
				ap.pause();
			}
			if (!paused && nativeAudio.paused) {
				ap.play();
			}
		}
	}

	$: {
		if (ap && nativeAudio.currentTime !== time) {
			ap.seek(time);
		}
	}

	export function player() {
		return ap;
	}
</script>

<div
	bind:this={target}
	style:width={mini ? undefined : "100%"}
	style:height={mini ? undefined : "100%"}
	style:margin="0"
	style:display={ready ? "block" : "none"}
></div>

{#if !ready}
	<slot>
		<div>Loading...</div>
	</slot>
{/if}
