<template>
    <div class="radio-view">
        <h1>Welcome to the Radio</h1>
        <audio ref="audioPlayer" :src="radioStreamUrl" controls></audio>

        <div class="controls">
            <button @click="play">Play</button>
            <button @click="pause">Pause</button>
            <button @click="stop">Stop</button>
        </div>

        <p>Status: <strong>{{ status }}</strong></p>

        <div class="now-playing" v-if="nowPlaying">
            <h2>Now Playing:</h2>
            <p>
                <strong v-html="decodeHtml(nowPlaying.artist)"></strong> -
                <span v-html="decodeHtml(nowPlaying.title)"></span>
            </p>
        </div>

        <div class="history" v-if="history.length > 0">
            <h2>Recent Tracks:</h2>
            <ul>
                <li v-for="(song, index) in history" :key="index">
                    <strong v-html="decodeHtml(song.artist)"></strong> -
                    <span v-html="decodeHtml(song.title)"></span>
                </li>
            </ul>
        </div>

        <!-- Add Butterchurn Visualizer -->
        <div class="visualizer">
            <ButterchurnVisualizer v-if="audioContext && analyserNode" :audioContext="audioContext"
                :audioSource="analyserNode" />
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
            radioStreamUrl: "https://radio.luhas.gratis/stream.mp3", // Replace with your radio stream URL
            historyApiUrl: "https://api.luhas.gratis/api/history", // Replace with your backend history API
            status: "Stopped",
            nowPlaying: null, // Metadata for now playing
            history: [], // History of the last 5 songs excluding the now playing
            audioContext: null,
            analyserNode: null,
        };
    },
    methods: {
        play() {
            const audioPlayer = this.$refs.audioPlayer;

            if (!audioPlayer) {
                console.error("Audio player not found.");
                return;
            }

            // Initialize AudioContext if not already initialized
            if (!this.audioContext) {
                this.initAudioContext();
            }

            // Resume AudioContext if it is suspended
            if (this.audioContext.state === "suspended") {
                this.audioContext.resume();
            }

            console.log("Audio player paused:", audioPlayer.paused);
            audioPlayer.play().then(() => {
                console.log("Playback started.");
            }).catch((error) => {
                console.error("Error starting playback:", error);
            });
        },
        pause() {
            const audioPlayer = this.$refs.audioPlayer;
            audioPlayer.pause();
            this.status = "Paused";
        },
        stop() {
            const audioPlayer = this.$refs.audioPlayer;
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
            this.status = "Stopped";
        },
        fetchHistory() {
            fetch(this.historyApiUrl)
                .then((response) => response.json())
                .then((data) => {
                    if (data.length > 0) {
                        this.nowPlaying = data[0]; // First song is now playing
                        this.history = data.slice(1); // Remaining songs are the history
                    }
                })
                .catch((error) => {
                    console.error("Error fetching history:", error);
                });
        },
        decodeHtml(html) {
            const textarea = document.createElement("textarea");
            textarea.innerHTML = html;
            return textarea.value;
        },
        initAudioContext() {
            if (!this.audioContext) {
                // Create the AudioContext
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

                // Reference the audio player element
                const audioPlayer = this.$refs.audioPlayer;

                // Create a MediaElementAudioSourceNode
                const source = this.audioContext.createMediaElementSource(audioPlayer);

                // Create an AnalyserNode for the visualizer
                this.analyserNode = this.audioContext.createAnalyser();

                // Connect the nodes: source -> analyser -> destination
                source.connect(this.analyserNode);
                this.analyserNode.connect(this.audioContext.destination); // Forward audio to speakers
            }
        },
    },
    mounted() {
        // Fetch history every 10 seconds
        this.fetchHistory();
        setInterval(this.fetchHistory, 10000);
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
