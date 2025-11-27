<template>
    <!-- Whole screen is a click target to (re)start audio -->
    <div class="flash-wrapper" @click="playAudio">
        <!-- Only the current image is rendered -->
        <img class="flash-image" :src="slides[currentSlideIndex]" alt="" />

        <audio ref="audioRef" :src="endMp3" loop></audio>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

// imports from src/assets/e
import img1 from "@/assets/e/1.jpg";
import img2 from "@/assets/e/2.gif";
import img3 from "@/assets/e/3.png";
import img4 from "@/assets/e/4.png";
import img5 from "@/assets/e/5.png";
import img6 from "@/assets/e/6.png";
import img7 from "@/assets/e/7.png";
import endMp3 from "@/assets/e/end.mp3";

const slides = [img1, img2, img3, img4, img5, img6, img7];

const currentSlideIndex = ref(0);
const audioRef = ref(null);

const frameIntervalMs = 100; // speed of switching
let timer = null;

function startLoop() {
    if (timer) return;
    timer = setInterval(() => {
        currentSlideIndex.value =
            (currentSlideIndex.value + 1) % slides.length;
    }, frameIntervalMs);
}

function stopLoop() {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
}

function playAudio() {
    if (!audioRef.value) return;
    const p = audioRef.value.play();
    if (p && typeof p.then === "function") {
        p.catch(() => {
            // ignored if autoplay blocked; click will retry
        });
    }
}

onMounted(() => {
    startLoop();
    playAudio(); // best effort; browser may block until user clicks

    // invert entire site
    document.documentElement.classList.add("invert-background");
});

onBeforeUnmount(() => {
    stopLoop();

    // restore normal site colors
    document.documentElement.classList.remove("invert-background");
});
</script>

<style scoped>
.flash-wrapper {
    min-height: 70vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;

    /* double-invert ONLY this area so the image looks normal */
    filter: invert(1) hue-rotate(180deg);
}

.flash-image {
    max-width: 50vw;
    max-height: 50vh;
    display: block;
}
</style>

<!-- GLOBAL (not scoped) inversion for the rest of the site -->
<style>
.invert-background {
    filter: invert(1) hue-rotate(180deg);
}
</style>
