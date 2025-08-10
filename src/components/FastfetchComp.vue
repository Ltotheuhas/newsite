<template>
    <div class="ff-wrap">
        <v-card class="ff-card">
            <v-card-text class="ff-body">
                <div v-if="error" class="text-error px-4 py-3">{{ error }}</div>
                <div v-else ref="termEl" class="term"></div>
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'

const ENDPOINT = '/fastfetch'

const termEl = ref(null)
let term, fit
const error = ref('')

function initTerm() {
    const isMobile = window.innerWidth < 768

    term = new Terminal({
        convertEol: true,
        disableStdin: true,
        cursorBlink: true,
        cursorStyle: 'block',
        fontFamily: "'Noto Sans Mono', monospace",
        fontSize: isMobile ? 6 : 13,
        lineHeight: 1,
        theme: {
            background: '#0b0e14',
            foreground: '#e6e6e6'
        }
    })
    fit = new FitAddon()
    term.loadAddon(fit)
    term.open(termEl.value)
    term.focus()
    fit.fit()
    window.addEventListener('resize', onResize)
}

function onResize() {
    if (fit) fit.fit()
}

async function load() {
    try {
        const res = await fetch(ENDPOINT, { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const text = await res.text()
        term.write(text)
        await nextTick()
        fit.fit()
    } catch (e) {
        error.value = String(e.message || e)
    }
}

onMounted(() => { initTerm(); load() })
onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize)
    term?.dispose()
})
</script>

<style scoped>
.ff-wrap {
    display: flex;
    justify-content: center;
    padding: 12px;
}

.ff-card {
    overflow: hidden;
    border-radius: 0;
    width: max-content;
    max-width: 95vw;
}

.ff-body {
    padding: 0;
}

.term {
    width: 100ch;
    overflow: hidden;
}

@media (max-width: 768px) {
    .term {
        width: 76ch;
    }
}
</style>
