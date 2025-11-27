<!-- WebampPlayer.vue -->
<template>
    <!-- Teleport into <body> to escape router / v-app layout -->
    <Teleport to="body">
        <div ref="webampContainer"></div>
    </Teleport>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import Webamp from "webamp"; // npm install webamp

const webampContainer = ref(null);
const isMounted = ref(false);
let webampInstance = null;

/**
 * webpack: load all audio files from src/assets/music
 * Adjust extensions if needed.
 */
const musicContext = require.context(
    "../assets/music",
    false,
    /\.(mp3|ogg|wav|flac)$/
);

const localTracks = musicContext.keys().map((key, index) => {
    const url = musicContext(key);

    const fileName = key.split("/").pop() || `Track ${index + 1}`;
    const withoutExt = fileName.replace(/\.[^/.]+$/, "");

    let artist = "Unknown Artist";
    let title = withoutExt;

    // If filename looks like "Artist - Title"
    const parts = withoutExt.split(" - ");
    if (parts.length >= 2) {
        artist = parts[0].trim() || artist;
        title = parts.slice(1).join(" - ").trim() || title;
    }

    return {
        metaData: { artist, title },
        url,
        id: `${index}-${fileName}`,
    };
});

onMounted(() => {
    isMounted.value = true;

    requestAnimationFrame(() => {
        if (!webampContainer.value) return;

        webampInstance = new Webamp({
            initialTracks: localTracks,
        });

        webampInstance
            .renderWhenReady(webampContainer.value)
            .then(() => {
                // After Webamp has rendered, brutally force its window to the very top
                const webampRoot =
                    webampContainer.value.querySelector("#webamp") ||
                    document.getElementById("webamp");

                if (webampRoot) {
                    webampRoot.style.position = "fixed";
                    webampRoot.style.top = "80px"; // adjust if you want it lower than navbar
                    webampRoot.style.left = "80px";
                    webampRoot.style.zIndex = "2147483647"; // max-ish z-index
                    webampRoot.style.pointerEvents = "auto";
                }
            })
            .catch((err) => {
                console.error("Failed to initialize Webamp:", err);
            });
    });
});

onBeforeUnmount(() => {
    if (webampInstance) {
        webampInstance.dispose();
        webampInstance = null;
    }
});
</script>

<style>
#webamp {
    inset: 0 !important;
    z-index: 1 !important;
}
</style>