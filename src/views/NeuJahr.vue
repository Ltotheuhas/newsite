<!-- NeuJahr.vue -->
<template>
    <div class="grid">
        <div v-for="(src, idx) in urls" :key="src" class="cell" role="button" tabindex="0" @click="open(idx)"
            @keydown.enter.prevent="open(idx)" @keydown.space.prevent="open(idx)">
            <img class="thumb" :src="src" alt="" loading="lazy" />
        </div>
    </div>

    <teleport to="body">
        <div v-if="openIdx !== null" class="overlay" @click="close">
            <img class="overlay-img" :src="urls[openIdx]" alt="" />
        </div>
    </teleport>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

const base = "/2025/";
const files = ref([]);

onMounted(async () => {
    // cache-bust so updates show immediately after regenerating manifest
    const res = await fetch(`${base}manifest.json?v=${Date.now()}`);
    if (!res.ok) throw new Error(`Failed to load manifest: ${res.status}`);
    files.value = await res.json();
});

function tsFromName(name) {
    // IMG_YYYYMMDD_HHMMSS
    const m = name.match(/(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})/);
    if (!m) return Number.POSITIVE_INFINITY;
    return Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]);
}

const urls = computed(() => {
    const arr = [...files.value];
    arr.sort((a, b) => (tsFromName(a) - tsFromName(b)) || a.localeCompare(b));
    return arr.map((f) => base + String(f).replace(/^\.\//, ""));
});

const openIdx = ref(null);

function open(idx) {
    openIdx.value = idx;
}
function close() {
    openIdx.value = null;
}

function onKeydown(e) {
    if (e.key === "Escape") close();
}

watch(openIdx, (v) => {
    const isOpen = v !== null;
    document.documentElement.style.overflow = isOpen ? "hidden" : "";
    if (isOpen) window.addEventListener("keydown", onKeydown);
    else window.removeEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
    document.documentElement.style.overflow = "";
    window.removeEventListener("keydown", onKeydown);
});
</script>

<style scoped>
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(32px, 1fr));
    gap: 0px;
    padding: 0px;
}

.cell {
    cursor: pointer;
    outline: none;
}

.thumb {
    width: 100%;
    height: 32px;
    object-fit: cover;
    display: block;
    border-radius: 0;
}

.overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    cursor: zoom-out;
}

.overlay-img {
    width: auto;
    height: auto;
    max-width: calc(100vw - 48px);
    max-height: calc(100vh - 48px);
    object-fit: contain;
    border-radius: 0;
    cursor: default;
    user-select: none;
    -webkit-user-drag: none;
}
</style>
