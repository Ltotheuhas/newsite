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
import { inject, ref, onMounted } from "vue";
import ButterchurnVisualizer from "../components/ButterchurnVisualizer.vue";

async function getCoverArt(artist, song, album = "") {
    const musicBrainzBaseURL = "https://musicbrainz.org/ws/2";
    const coverArtBaseURL = "https://coverartarchive.org/release-group/";

    try {
        let searchQuery = `recording:${encodeURIComponent(song)} AND artist:${encodeURIComponent(artist)}`;
        if (album) {
            searchQuery += ` AND release:${encodeURIComponent(album)}`;
        }

        const searchUrl = `${musicBrainzBaseURL}/recording/?query=${searchQuery}&fmt=json`;

        const response = await fetch(searchUrl, {
            headers: {
                "User-Agent": "MyMusicApp/1.0 (your_email@example.com)"
            }
        });

        const data = await response.json();

        if (!data.recordings || data.recordings.length === 0) {
            return null;
        }

        let selectedReleaseGroupId = null;

        // 🔍 Check for a release group that matches the exact album name
        for (const recording of data.recordings) {
            if (!recording.releases) continue;

            for (const release of recording.releases) {
                if (!release["release-group"]) continue;

                const releaseGroup = release["release-group"];
                const releaseGroupId = releaseGroup.id;
                const releaseGroupTitle = releaseGroup.title.toLowerCase();

                // 🎯 Prioritize exact album match
                if (album && releaseGroupTitle === album.toLowerCase()) {
                    selectedReleaseGroupId = releaseGroupId;
                    break;
                }

                // ✅ Fallback: Store the first available album if no exact match
                if (!selectedReleaseGroupId) {
                    selectedReleaseGroupId = releaseGroupId;
                }
            }

            if (selectedReleaseGroupId) break;
        }

        const coverArtUrl = `${coverArtBaseURL}${selectedReleaseGroupId}/front`;
        const coverResponse = await fetch(coverArtUrl, { method: "HEAD" });

        if (coverResponse.ok) {
            return coverArtUrl;
        }

        return null;

    } catch (error) {
        return null;
    }
}

export default {
    name: "RadioView",
    components: {
        ButterchurnVisualizer,
    },
    setup() {
        const globalAudio = inject("globalAudio");
        const isMuted = inject("isMuted");
        const volume = inject("volume");
        const nowPlaying = inject("nowPlaying");

        const albumCoverUrl = ref(null);
        const history = ref([]);

        const historyApiUrl = "https://api.luhas.gratis/api/history";
        const lastFmApiKey = "5b76a7a11283ba1fbe8d1871b9756514";

        const audioContext = ref(null);
        const analyserNode = ref(null);

        async function ensureAudioContext() {
            if (audioContext.value && audioContext.value.state === "suspended") {
                await audioContext.value.resume();
            }
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
                    console.warn("MediaElementSource already created, using existing node.");
                }
            }
        }

        function toggleMute() {
            if (!globalAudio.value) return;

            if (isMuted.value) {
                isMuted.value = false;
                globalAudio.value.muted = false;

                if (volume.value === 0) {
                    volume.value = 0.5;
                    globalAudio.value.volume = 0.5;
                }

                ensureAudioContext().then(() => {
                    globalAudio.value.play().then(() => {
                        initAudioContext();
                    }).catch(err => console.error("Play error after unmute:", err));
                });

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
                ensureAudioContext().then(() => {
                    globalAudio.value.play().then(() => {
                        initAudioContext();
                    }).catch(err => console.error("Play error after volume change:", err));
                });
            } else if (volume.value === 0) {
                isMuted.value = true;
                globalAudio.value.muted = true;
            }
        }

        async function fetchHistory() {
            try {
                const response = await fetch(historyApiUrl);
                const data = await response.json();
                if (data.length > 0) {
                    nowPlaying.value = { artist: data[0].artist, title: data[0].title, album: data[0].album || null, };
                    history.value = data.slice(1);
                    await fetchAlbumCover(nowPlaying.value.artist, nowPlaying.value.title, nowPlaying.value.album);
                } else {
                    nowPlaying.value = { artist: "", title: "", album: null };
                    history.value = [];
                    albumCoverUrl.value = null;
                }
            } catch (error) {
                console.error("Error fetching history:", error);
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
                const encodedAlbum = album ? encodeURIComponent(album.trim()) : null;

                // First attempt: Last.fm
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

                // If Last.fm fails, attempt MusicBrainz
                const musicBrainzCover = await getCoverArt(artist, title, encodedAlbum);
                if (musicBrainzCover) {
                    albumCoverUrl.value = musicBrainzCover;
                    return;
                }

                // Fallback if both fail
                albumCoverUrl.value = "https://placehold.co/200x200?text=No+Cover";
            } catch (err) {
                albumCoverUrl.value = "https://placehold.co/200x200?text=Error";
            }
        }

        function decodeHtml(str) {
            const textarea = document.createElement("textarea");
            textarea.innerHTML = str;
            return textarea.value;
        }

        onMounted(() => {
            fetchHistory();
            setInterval(fetchHistory, 10000);

            ensureAudioContext().then(() => {
                initAudioContext();
            });
        });

        return {
            globalAudio,
            isMuted,
            volume,
            nowPlaying,
            albumCoverUrl,
            history,
            audioContext,
            analyserNode,
            decodeHtml,
            fetchHistory,
            fetchAlbumCover,
            initAudioContext,
            ensureAudioContext,
            toggleMute,
            onVolumeChange,
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
