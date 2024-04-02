export interface ExtendedEvent {
	listshow: void;
	listhide: void;
	listadd: void;
	listremove: void;
	listswitch: void;
	listclear: void;
	noticeshow: void;
	noticehide: void;
	destroy: void;
	lrcshow: void;
	lrchide: void;
}

export type PlayerEvent = HTMLMediaElementEventMap & ExtendedEvent;

/**
 * Player options, same as https://aplayer.js.org/#/home?id=options
 */
export interface PlayerOption {
	fixed: boolean;
	mini: boolean;
	autoplay: boolean;
	theme: string;
	loop: "all" | "one" | "none";
	order: "list" | "random";
	preload: "none" | "metadata" | "auto";
	volume: number;
	mutex: boolean;
	listFolded: boolean;
	storageName: string;
	audio: Playlist;
	listMaxHeight?: string;
	customAudioType?: Record<string, CustomAudioHandler>;
}

export interface AudioSource {
	name?: string;
	artist?: string;
	url: URL;
	cover?: URL;
	lrc?: string | URL;
	theme?: string;
	type?: "auto" | "hls" | "normal" | (string & Record<string, never>);
}

export type Playlist = AudioSource[];

export type CustomAudioHandler = (
	element: HTMLAudioElement,
	audio: AudioSource,
	player: unknown,
) => void;
