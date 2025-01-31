<template>
    <div class="radio-view">
        <h1>Welcome to the Radio</h1>

        <!-- Hidden audio element (no native controls) -->
        <audio ref="audioPlayer" :src="radioStreamUrl" preload="auto" style="display: none;"></audio>

        <!-- Custom Controls -->
        <div class="controls">
            <button @click="toggleMute">{{ isMuted ? "Unmute" : "Mute" }}</button>

            <input type="range" min="0" max="1" step="0.01" v-model="volume" @input="onVolumeChange" />
        </div>

        <div class="now-playing" v-if="nowPlaying">
            <h2>Now Playing:</h2>
            <p>
                <strong>{{ decodeHtml(nowPlaying.artist) }}</strong> -
                <span>{{ decodeHtml(nowPlaying.title) }}</span>
            </p>
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

        <!-- Optional Butterchurn Visualizer -->
        <div class="visualizer" v-if="audioContext && analyserNode">
            <ButterchurnVisualizer :audioContext="audioContext" :audioSource="analyserNode" />
        </div>
    </div>
</template>

<script>
import ButterchurnVisualizer from "../components/ButterchurnVisualizer.vue";

export default {
    name: "RadioView",
    components: {
        ButterchurnVisualizer,
    },
    data() {
        return {
            radioStreamUrl: "https://radio.luhas.gratis/stream.mp3",
            historyApiUrl: "https://api.luhas.gratis/api/history",

            // New player states
            isMuted: true,
            volume: 0,              // Start slider fully left (0)
            autoplayBlocked: false, // Track if autoplay was blocked

            nowPlaying: null,
            history: [],
            audioContext: null,
            analyserNode: null,
        };
    },
    mounted() {
        // 1. Fetch history (nowPlaying + recent tracks)
        this.fetchHistory();
        setInterval(this.fetchHistory, 10000);

        // 2. Initialize audio + attempt autoplay (muted)
        const audioPlayer = this.$refs.audioPlayer;
        audioPlayer.muted = this.isMuted;
        audioPlayer.volume = this.volume;

        // Try to start playing silently
        audioPlayer.play().catch((err) => {
            console.warn("Autoplay blocked or not possible:", err);
            this.autoplayBlocked = true;
        });
    },
    methods: {
        async fetchHistory() {
            try {
                const response = await fetch(this.historyApiUrl);
                const data = await response.json();
                if (data.length > 0) {
                    this.nowPlaying = data[0];
                    this.history = data.slice(1);
                }
            } catch (error) {
                console.error("Error fetching history:", error);
            }
        },

        decodeHtml(html) {
            const textarea = document.createElement("textarea");
            textarea.innerHTML = html;
            return textarea.value;
        },

        // Initialize AudioContext and connect to the visualizer
        initAudioContext() {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

                const audioPlayer = this.$refs.audioPlayer;
                const source = this.audioContext.createMediaElementSource(audioPlayer);

                this.analyserNode = this.audioContext.createAnalyser();
                source.connect(this.analyserNode);
                this.analyserNode.connect(this.audioContext.destination);
            }
        },

        /**
         * Toggle muted/unmuted when the button is clicked
         * If unmuting, ensure playback starts
         */
        toggleMute() {
            const audioPlayer = this.$refs.audioPlayer;

            if (this.isMuted) {
                // We are currently muted => unmute
                this.isMuted = false;
                audioPlayer.muted = false;

                // Set a default volume if slider is at 0
                if (this.volume === 0) {
                    this.volume = 0.5;
                    audioPlayer.volume = 0.5;
                }

                // Attempt to play
                audioPlayer.play().then(() => {
                    // Initialize audio context once user unmutes (if not done yet)
                    this.initAudioContext();
                }).catch((err) => {
                    console.error("Play error after unmute:", err);
                });

            } else {
                // We are currently unmuted => mute
                this.isMuted = true;
                audioPlayer.muted = true;

                // Move slider to 0 so the user sees it's muted
                this.volume = 0;
                audioPlayer.volume = 0;
            }
        },

        /**
         * Called when volume slider changes
         * If volume > 0 => unmute & attempt playback
         * If volume = 0 => mute
         */
        onVolumeChange() {
            const audioPlayer = this.$refs.audioPlayer;
            audioPlayer.volume = this.volume;

            // If user drags above 0 and we're muted => unmute
            if (this.volume > 0 && this.isMuted) {
                this.isMuted = false;
                audioPlayer.muted = false;

                audioPlayer.play().then(() => {
                    this.initAudioContext();
                }).catch((err) => {
                    console.error("Play error after volume change:", err);
                });
            }
            // If user drags volume to 0 => mute
            else if (this.volume === 0) {
                this.isMuted = true;
                audioPlayer.muted = true;
            }
        },
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