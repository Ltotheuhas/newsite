<template>
    <div class="compact-radio-player">
        <div class="player-container">
            <!-- Album Cover -->
            <div class="album-cover">
                <img v-if="albumCoverUrl" :src="albumCoverUrl" alt="Album Cover" />
            </div>

            <!-- Song Info -->
            <div class="song-info">
                <!-- Artist -->
                <div ref="artistContainer" class="artist marquee-container" :class="{ scrolling: isArtistOverflow }">
                    <span ref="artistSpan">{{ decodeHtml(nowPlaying?.artist || "Unknown Artist") }}</span>
                </div>

                <!-- Title -->
                <div ref="titleContainer" class="title marquee-container" :class="{ scrolling: isTitleOverflow }">
                    <span ref="titleSpan">{{ decodeHtml(nowPlaying?.title || "Unknown Title") }}</span>
                </div>
            </div>

            <!-- Controls -->
            <div class="controls">
                <button @click="toggleMute">
                    {{ isMuted ? "Unmute" : "Mute" }}
                </button>

                <input type="range" min="0" max="1" step="0.01" v-model="volume" @input="onVolumeChange" />
            </div>
        </div>
    </div>
</template>

<script>
import { inject, ref, onMounted, nextTick } from "vue";

export default {
    name: "RadioComp",

    setup() {
        const globalAudio = inject("globalAudio");
        const isMuted = inject("isMuted");
        const volume = inject("volume");
        const nowPlaying = inject("nowPlaying");

        const albumCoverUrl = ref(null);

        // Overflow detection
        const isArtistOverflow = ref(false);
        const isTitleOverflow = ref(false);

        // Endpoints
        const historyApiUrl = "https://api.luhas.gratis/api/history";
        const lastFmApiKey = "5b76a7a11283ba1fbe8d1871b9756514";

        // On mount, fetch now-playing info
        onMounted(() => {
            fetchNowPlaying();
            setInterval(fetchNowPlaying, 10000);
        });

        /**
         * Fetch the now-playing track from your backend (the first item).
         */
        async function fetchNowPlaying() {
            try {
                const response = await fetch(historyApiUrl);
                const data = await response.json();
                if (data.length > 0) {
                    nowPlaying.value = {
                        artist: data[0].artist,
                        title: data[0].title,
                    };
                    await fetchAlbumCover(nowPlaying.value.artist, nowPlaying.value.title);
                } else {
                    nowPlaying.value = { artist: "", title: "" };
                    albumCoverUrl.value = null;
                }
                // Check overflow after DOM update
                nextTick(() => {
                    checkOverflow();
                });
            } catch (err) {
                console.error("Error fetching now-playing:", err);
            }
        }

        async function fetchAlbumCover(artist, title) {
            if (!artist || !title) {
                albumCoverUrl.value = "https://placehold.co/200x200?text=No+Cover";
                return;
            }

            try {
                // URL encode parameters to handle special characters
                const encodedArtist = encodeURIComponent(artist.trim());
                const encodedTitle = encodeURIComponent(title.trim());

                // Try fetching track info first
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

                // If track info fails, try album info lookup
                const albumUrl = `https://ws.audioscrobbler.com/2.0/?method=album.getInfo&api_key=${lastFmApiKey}&artist=${encodedArtist}&album=${encodedTitle}&format=json`;
                const albumResp = await fetch(albumUrl);
                const albumData = await albumResp.json();

                if (albumData?.album?.image?.length) {
                    const albumImages = albumData.album.image;
                    const largestImage = albumImages[albumImages.length - 1]["#text"];
                    if (largestImage) {
                        albumCoverUrl.value = largestImage;
                        return;
                    }
                }

                // Fallback if no cover found
                albumCoverUrl.value = "https://placehold.co/200x200?text=No+Cover";
            } catch (err) {
                console.error("Error fetching album cover:", err);
                albumCoverUrl.value = "https://placehold.co/200x200?text=Error";
            }
        }

        /**
         * Check if artist/title overflows => apply scrolling.
         */
        function checkOverflow() {
            const artistContainer = document.querySelector(".artist.marquee-container");
            const artistSpan = document.querySelector(".artist.marquee-container span");
            const titleContainer = document.querySelector(".title.marquee-container");
            const titleSpan = document.querySelector(".title.marquee-container span");

            if (artistContainer && artistSpan) {
                isArtistOverflow.value =
                    artistSpan.scrollWidth > artistContainer.clientWidth;
            }
            if (titleContainer && titleSpan) {
                isTitleOverflow.value =
                    titleSpan.scrollWidth > titleContainer.clientWidth;
            }
        }

        /**
         * Decode HTML entities.
         */
        function decodeHtml(str) {
            const textarea = document.createElement("textarea");
            textarea.innerHTML = str;
            return textarea.value;
        }

        /**
         * Toggle global audio's muted state.
         */
        function toggleMute() {
            if (!globalAudio.value) return;
            if (isMuted.value) {
                // Unmute
                isMuted.value = false;
                globalAudio.value.muted = false;
                volume.value = 0.5;
                globalAudio.value.volume = 0.5;
                globalAudio.value.play().catch(err => {
                    console.error("Play error after unmute:", err);
                });
            } else {
                // Mute
                isMuted.value = true;
                globalAudio.value.muted = true;
                volume.value = 0;
                globalAudio.value.volume = 0;
            }
        }

        /**
         * If volume > 0 => unmute. If volume = 0 => mute.
         */
        function onVolumeChange() {
            if (!globalAudio.value) return;
            globalAudio.value.volume = volume.value;

            if (volume.value > 0 && isMuted.value) {
                isMuted.value = false;
                globalAudio.value.muted = false;
                globalAudio.value.play().catch(err => {
                    console.error("Play error after volume change:", err);
                });
            } else if (volume.value === 0) {
                isMuted.value = true;
                globalAudio.value.muted = true;
            }
        }

        return {
            // Injections
            globalAudio,
            isMuted,
            volume,

            // Local data
            nowPlaying,
            albumCoverUrl,
            isArtistOverflow,
            isTitleOverflow,

            // Methods
            fetchNowPlaying,
            fetchAlbumCover,
            checkOverflow,
            decodeHtml,
            toggleMute,
            onVolumeChange,
        };
    },
};
</script>

<style scoped>
.compact-radio-player {
    font-family: Arial, sans-serif;
    text-align: center;
    margin: 20px auto;
    width: 300px;
    /* adjust as needed */
}

.player-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #2b2b2b;
    padding: 10px;
    border-radius: 8px;
}

.album-cover {
    margin-bottom: 10px;
}

.album-cover img {
    width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
}

.song-info {
    margin-bottom: 10px;
    color: #fff;
    width: 200px;
    /* helps define marquee area */
    text-align: center;
}

/* 
    We only animate (scroll) if .scrolling is present 
    => text is too wide for its container
  */
.marquee-container {
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    height: 1.5em;
    margin: 4px 0;
}

.marquee-container span {
    display: inline-block;
    box-sizing: border-box;
}

.marquee-container.scrolling span {
    animation: marquee 8s linear infinite;
}

@keyframes marquee {
    0% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(-100%);
    }
}

.controls {
    display: flex;
    gap: 8px;
    margin-top: 10px;
}

button {
    color: #fff;
    background-color: #444;
    border: none;
    border-radius: 4px;
    padding: 6px 10px;
    cursor: pointer;
}

button:hover {
    background-color: #555;
}

input[type="range"] {
    width: 100px;
    cursor: pointer;
}
</style>