<template>
    <div class="radio-view">
        <h1>Welcome to the Radio</h1>

        <div class="controls">
            <button @click="toggleMute">{{ isMuted ? "Unmute" : "Mute" }}</button>
            <input type="range" min="0" max="1" step="0.01" v-model="volume" @input="onVolumeChange" />
        </div>

        <div class="now-playing" v-if="nowPlaying">
            <h2>Now Playing:</h2>
            <p>
                <strong>{{ decodeHtml(nowPlaying.artist || "Unknown Artist") }}</strong> -
                <span>{{ decodeHtml(nowPlaying.title || "Unknown Title") }}</span>
            </p>
            <img v-if="albumCoverUrl" :src="albumCoverUrl" class="album-cover" />
        </div>

        <div class="history" v-if="history.length > 0">
            <h2>Recent Tracks:</h2>
            <ul>
                <li v-for="(song, index) in history" :key="index">
                    <strong>{{ decodeHtml(song.artist) }}</strong> -
                    <span>{{ decodeHtml(song.title) }}</span>
                </li>
            </ul>
        </div>

        <div class="visualizer" v-if="audioContext && analyserNode">
            <ButterchurnVisualizer :audioContext="audioContext" :audioSource="analyserNode" />
        </div>
    </div>
</template>

<script>
import { onMounted, ref, inject } from "vue";
import { useRadioPlayer } from "@/composables/useRadioPlayer";
import ButterchurnVisualizer from "@/components/ButterchurnVisualizer.vue";

export default {
    name: "RadioView",
    components: {
        ButterchurnVisualizer,
    },
    setup() {
        const radio = useRadioPlayer();
        const audioContext = ref(null);
        const analyserNode = ref(null);
        const globalAudio = inject("globalAudio");

        function ensureAudioContext() {
            if (!audioContext.value) return Promise.resolve();
            if (audioContext.value.state === "suspended") {
                return audioContext.value.resume();
            }
            return Promise.resolve();
        }

        function initAudioContext() {
            if (!audioContext.value) {
                audioContext.value = new (window.AudioContext || window.webkitAudioContext)();
            }

            if (!analyserNode.value) {
                analyserNode.value = audioContext.value.createAnalyser();
                analyserNode.value.fftSize = 2048;
            }

            if (!globalAudio.value.audioSource) {
                try {
                    globalAudio.value.audioSource = audioContext.value.createMediaElementSource(globalAudio.value);
                    globalAudio.value.audioSource.connect(analyserNode.value);
                    analyserNode.value.connect(audioContext.value.destination);
                } catch (error) {
                    console.warn("MediaElementSource already exists.");
                }
            }
        }

        onMounted(() => {
            radio.fetchNowPlaying();
            setInterval(radio.fetchNowPlaying, 10000);

            ensureAudioContext().then(() => {
                initAudioContext();
            });
        });

        return {
            ...radio,
            audioContext,
            analyserNode,
            ensureAudioContext,
            initAudioContext,
        };
    },
};
</script>

<style scoped>
.radio-view {
    font-family: Arial, sans-serif;
    text-align: center;
    margin: 20px;
}

.controls {
    margin-top: 15px;
    display: inline-flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
}

button {
    margin: 5px;
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}

input[type="range"] {
    width: 150px;
    cursor: pointer;
}

.now-playing {
    margin-top: 20px;
    padding: 10px;
}

.album-cover {
    width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    margin-top: 10px;
}

.history {
    margin-top: 20px;
    padding: 10px;
}

.history ul {
    list-style: none;
    padding: 0;
}

.history li {
    margin: 5px 0;
}

.visualizer {
    margin-top: 20px;
}
</style>