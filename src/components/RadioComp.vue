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
                <div ref="artistContainer" class="scroll-container">
                    <div ref="artistTrack" class="scroll-track" :class="{ animate: isArtistOverflow }">
                        <span class="scroll-text" :style="{ paddingRight: isArtistOverflow ? '32px' : '0' }">
                            {{ artistText }}
                        </span>
                        <span v-if="isArtistOverflow" class="scroll-text" :style="{ paddingRight: '32px' }">
                            {{ artistText }}
                        </span>
                    </div>
                </div>

                <!-- Title -->
                <div ref="titleContainer" class="scroll-container">
                    <div ref="titleTrack" class="scroll-track" :class="{ animate: isTitleOverflow }">
                        <span class="scroll-text" :style="{ paddingRight: isTitleOverflow ? '32px' : '0' }">
                            {{ titleText }}
                        </span>
                        <span v-if="isTitleOverflow" class="scroll-text" :style="{ paddingRight: '32px' }">
                            {{ titleText }}
                        </span>
                    </div>
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
import { ref, onMounted, nextTick, computed, watch } from "vue";
import { useRadioPlayer } from "@/composables/useRadioPlayer";

export default {
    name: "RadioComp",
    setup() {
        const radio = useRadioPlayer();

        // Artist scroll
        const artistContainer = ref(null);
        const artistTrack = ref(null);
        const isArtistOverflow = ref(false);
        const artistText = computed(() =>
            radio.decodeHtml(radio.nowPlaying.value?.artist || "Unknown Artist")
        );

        // Title scroll
        const titleContainer = ref(null);
        const titleTrack = ref(null);
        const isTitleOverflow = ref(false);
        const titleText = computed(() =>
            radio.decodeHtml(radio.nowPlaying.value?.title || "Unknown Title")
        );

        function checkScrollOverflow(containerRef, trackRef, isOverflowRef) {
            nextTick(() => {
                const container = containerRef.value;
                const track = trackRef.value;
                const span = track?.querySelector(".scroll-text");

                if (container && span) {
                    const scrollWidth = span.offsetWidth;
                    const containerWidth = container.clientWidth;

                    if (scrollWidth > containerWidth) {
                        container.style.setProperty("--scroll-width", `${scrollWidth + 32}px`); // +gap
                        isOverflowRef.value = true;
                    } else {
                        isOverflowRef.value = false;
                    }
                }
            });
        }

        function checkBothScrolls() {
            checkScrollOverflow(artistContainer, artistTrack, isArtistOverflow);
            checkScrollOverflow(titleContainer, titleTrack, isTitleOverflow);
        }

        onMounted(() => {
            radio.fetchNowPlaying();
            setInterval(radio.fetchNowPlaying, 10000);
        });

        watch(() => radio.nowPlaying?.artist, checkBothScrolls, { immediate: true });
        watch(() => radio.nowPlaying?.title, checkBothScrolls, { immediate: true });

        return {
            ...radio,
            artistContainer,
            artistTrack,
            isArtistOverflow,
            artistText,
            titleContainer,
            titleTrack,
            isTitleOverflow,
            titleText,
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

.scroll-container {
    overflow: hidden;
    position: relative;
    width: 100%;
    height: 1.5em;
    margin: 4px 0;
    text-align: center;
}

.scroll-track {
    display: inline-flex;
    width: fit-content;
    will-change: transform;
    justify-content: center;
}

.scroll-track.animate {
    animation: seamless-scroll 10s linear infinite;
}

.scroll-text {
    white-space: nowrap;
}

@keyframes seamless-scroll {
    0% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(calc(-1 * var(--scroll-width, 100%)));
    }
}
</style>