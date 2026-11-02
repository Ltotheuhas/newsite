<template>
    <main class="tv-page">
        <div ref="playerFrame" class="player-frame">
            <video ref="video" playsinline tabindex="-1" @error="onVideoError" />

            <div v-if="!started" class="overlay">
                <button @click="tuneIn">TUNE IN</button>
            </div>
        </div>

        <div style="display: none;" class="controls">
            <button @click="goLive" :disabled="!started">
                RETURN TO LIVE
            </button>
        </div>

        <p v-if="error" class="error">{{ error }}</p>

        <TvGuide />
    </main>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'
import TvGuide from '@/components/TvGuide.vue'
import Hls from 'hls.js'

const STREAM_URL =
    '/stream/channels/4a9dcd1b-e8f5-40b4-b4ec-100bb73a33e8.m3u8'

const video = ref(null)
const playerFrame = ref(null)
const started = ref(false)
const error = ref('')

let hls = null

function destroyPlayer() {
    if (hls) {
        hls.destroy()
        hls = null
    }

    if (video.value) {
        video.value.pause()
        video.value.removeAttribute('src')
        video.value.load()
    }

    started.value = false
}

function tuneIn() {
    destroyPlayer()
    error.value = ''

    const element = video.value
    if (!element) return

    if (Hls.isSupported()) {
        hls = new Hls({
            lowLatencyMode: false,
            liveSyncDurationCount: 3
        })

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            element.play().catch(() => {
                error.value = 'Press Play to start the broadcast.'
            })
        })

        hls.on(Hls.Events.ERROR, (_, data) => {
            if (data.fatal) {
                error.value = `Playback error: ${data.details}`
                destroyPlayer()
            }
        })

        hls.loadSource(STREAM_URL)
        hls.attachMedia(element)
    } else if (
        element.canPlayType('application/vnd.apple.mpegurl')
    ) {
        element.src = STREAM_URL
        element.play().catch(() => {
            error.value = 'Click TUNE IN to start the broadcast.'
            started.value = false
        })
    } else {
        error.value = 'Your browser does not support HLS.'
        return
    }

    started.value = true
}

function goLive() {
    const element = video.value
    if (!element) return

    const position = hls?.liveSyncPosition

    if (Number.isFinite(position)) {
        element.currentTime = position
    } else if (element.seekable.length) {
        element.currentTime =
            element.seekable.end(element.seekable.length - 1)
    }

    element.play().catch(() => { })
}

function onVideoError() {
    if (!hls) {
        error.value = 'Video playback failed.'
    }
}

onBeforeUnmount(destroyPlayer)
</script>

<style scoped>
.tv-page {
    max-width: 1100px;
    margin: 0 auto;
    padding: 32px 20px;
    color: #eee;
    font-family: monospace;
}

.tv-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
}

.tv-header h1 {
    font-size: 28px;
    margin: 0;
}

.on-air {
    color: #f55;
    font-size: 13px;
}

.player-frame {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    background: #000;
    overflow: hidden;
    aspect-ratio: 4 / 3;
}

.player-frame video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    pointer-events: none;
}

.channel-logo {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 20px;
    font-weight: bold;
    color: white;
    text-shadow: 0 2px 6px black;
    pointer-events: none;
}

.overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, .7);
}

.overlay button {
    padding: 15px 30px;
    background: white;
    border: none;
    color: black;
    font: bold 18px monospace;
    cursor: pointer;
}

.controls {
    display: flex;
    gap: 12px;
    margin-top: 12px;
}

.controls button {
    padding: 10px 16px;
    background: #222;
    color: #eee;
    border: 1px solid #555;
    cursor: pointer;
    font: inherit;
}

.controls button:disabled {
    opacity: .4;
}

.description {
    color: #888;
    margin-top: 24px;
}

.error {
    color: #ff7777;
}

.player-frame:fullscreen {
    aspect-ratio: auto;
    height: 100%;
}
</style>
