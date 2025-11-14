import { inject, ref, nextTick } from "vue";
import { trySmartCoverArt } from "@/utils/radioUtils";

const historyApiUrl = "https://api.luh.as/history";
const lastFmApiKey = "5b76a7a11283ba1fbe8d1871b9756514";

let firstPlay = true;
const baseUrl = "https://radio.luh.as/stream.mp3";

export function useRadioPlayer() {
    const globalAudio = inject("globalAudio");
    const isMuted = inject("isMuted");
    const volume = inject("volume");
    const nowPlaying = inject("nowPlaying");

    const albumCoverUrl = ref(null);
    const history = ref([]);

    const isArtistOverflow = ref(false);
    const isTitleOverflow = ref(false);

    function decodeHtml(str) {
        const textarea = document.createElement("textarea");
        textarea.innerHTML = str;
        return textarea.value;
    }

    function reloadStream() {
        globalAudio.value.src = `${baseUrl}?t=${Date.now()}`;
        globalAudio.value.load();
    }

    function toggleMute() {
        if (!globalAudio.value) return;

        if (isMuted.value) {
            if (firstPlay) {
                reloadStream();
                firstPlay = false;
            }
            isMuted.value = false;
            globalAudio.value.muted = false;
            volume.value = 0.5;
            globalAudio.value.volume = 0.5;
            globalAudio.value.play().catch(console.error);
        } else {
            isMuted.value = true;
            globalAudio.value.muted = true;
            volume.value = 0;
            globalAudio.value.volume = 0;
        }
    }

    function onVolumeChange() {
        if (!globalAudio.value) return;
        globalAudio.value.volume = volume.value;

        if (volume.value > 0 && isMuted.value) {
            isMuted.value = false;
            globalAudio.value.muted = false;
            globalAudio.value.play().catch(err => console.error("Play error after volume change:", err));
        } else if (volume.value === 0) {
            isMuted.value = true;
            globalAudio.value.muted = true;
        }
    }

    async function fetchNowPlaying() {
        try {
            const response = await fetch(historyApiUrl);
            const data = await response.json();

            if (data.length > 0) {
                nowPlaying.value = {
                    artist: data[0].artist,
                    title: data[0].title,
                    album: data[0].album || null,
                };
                history.value = data.slice(1);
                await fetchAlbumCover(nowPlaying.value.artist, nowPlaying.value.title, nowPlaying.value.album);
            } else {
                nowPlaying.value = { artist: "", title: "", album: null };
                albumCoverUrl.value = null;
                history.value = [];
            }

            nextTick(() => checkOverflow());
        } catch (err) {
            console.error("Error fetching now-playing:", err);
        }
    }

    async function fetchAlbumCover(artist, title, album) {
        if (!artist || !title) {
            albumCoverUrl.value = "https://placehold.co/200x200?text=No+Cover";
            return;
        }

        try {
            const encodedArtist = encodeURIComponent(artist.trim());
            const encodedTitle = encodeURIComponent(title.trim());

            const trackUrl = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${lastFmApiKey}&artist=${encodedArtist}&track=${encodedTitle}&format=json`;
            const trackResp = await fetch(trackUrl);
            const trackData = await trackResp.json();

            if (trackData?.track?.album?.image?.length) {
                const albumImages = trackData.track.album.image;
                const largestImage = albumImages[albumImages.length - 1]["#text"];
                if (largestImage) {
                    albumCoverUrl.value = largestImage;
                    return;
                }
            }

            const musicBrainzCover = await trySmartCoverArt(artist.trim(), title.trim(), album?.trim());
            if (musicBrainzCover) {
                albumCoverUrl.value = musicBrainzCover;
                return;
            }

            albumCoverUrl.value = "https://placehold.co/200x200?text=No+Cover";
        } catch (err) {
            albumCoverUrl.value = "https://placehold.co/200x200?text=Error";
            console.error("fetchAlbumCover error:", err);
        }
    }

    function checkOverflow() {
        const artistContainer = document.querySelector(".artist.marquee-container");
        const artistSpan = document.querySelector(".artist.marquee-container span");
        const titleContainer = document.querySelector(".title.marquee-container");
        const titleSpan = document.querySelector(".title.marquee-container span");

        if (artistContainer && artistSpan) {
            isArtistOverflow.value = artistSpan.scrollWidth > artistContainer.clientWidth;
        }
        if (titleContainer && titleSpan) {
            isTitleOverflow.value = titleSpan.scrollWidth > titleContainer.clientWidth;
        }
    }

    return {
        globalAudio,
        isMuted,
        volume,
        nowPlaying,
        albumCoverUrl,
        history,
        isArtistOverflow,
        isTitleOverflow,
        fetchNowPlaying,
        fetchAlbumCover,
        toggleMute,
        onVolumeChange,
        decodeHtml,
        checkOverflow,
    };
}
