<template>
    <div class="layer" ref="layer" @click="onLayerClick">
        <!-- floating wishes -->
        <span v-for="w in wishes" :key="w.id" class="wish" :style="{ transform: `translate(${w.x}px,${w.y}px)` }">
            {{ w.text }}
        </span>

        <!-- popup form -->
        <form v-if="form.visible" class="wish-form" :style="{ left: form.x + 'px', top: form.y + 'px' }"
            @submit.prevent="submit" @click.stop>
            <input ref="inp" v-model="val" placeholder="voice your wish"
                @input="val = val.replace(/\s+/g, '').slice(0, 24)" @keydown.esc="closeForm" />
            <button type="submit">send</button>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const wishes = ref([]);
const form = ref({ visible: false, x: 0, y: 0 });
const val = ref('');
const inp = ref(null);
const layer = ref(null);

let raf = 0, last = 0;
const bounds = { w: 0, h: 0 };

const API = 'https://api.luhas.gratis/shrine';

async function loadExisting() {
    try {
        const r = await fetch(`${API}/wishes?limit=200`, { cache: 'no-store' });
        const arr = await r.json();
        const pad = 48;
        for (const it of arr) {
            // scatter into safe zone
            const x0 = Math.random() * (bounds.w - 2 * pad) + pad;
            const y0 = Math.random() * (bounds.h - 2 * pad) + pad;
            spawn(it.text, x0, y0);
        }
    } catch (_) {
        // ignore fetch errors for now
    }
}

/* utils */
function fnv1a32(str) { let h = 0x811c9dc5; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); } return h >>> 0; }
function mulberry32(a) { return function () { let t = a += 0x6D2B79F5; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function map(v, a, b, c, d) { return c + (v - a) * (d - c) / (b - a); }

/* spawn */
function spawn(word, x0, y0) {
    const rnd = mulberry32(fnv1a32(word));
    const baseSpeed = map(rnd(), 0, 1, 28, 110);
    const omega = map(rnd(), 0, 1, -0.9, 0.9);
    const amp = map(rnd(), 0, 1, 12, 44);
    const freq = map(rnd(), 0, 1, 0.2, 1.1);
    const wiggle = map(rnd(), 0, 1, 0.2, 1.2);
    const margin = Math.round(map(rnd(), 0, 1, 28, 64));
    const ang = map(rnd(), 0, 1, 0, Math.PI * 2);

    const id = crypto.randomUUID?.() ?? String(Date.now() + Math.random());
    wishes.value.push({
        id, text: word, x: x0, y: y0, ang,
        speed: baseSpeed, omega, amp, freq, wiggle, margin, t0: performance.now() * 0.001
    });
}

/* motion */
function tick(ts) {
    if (!last) last = ts;
    const t = ts * 0.001;
    const dt = Math.min(0.05, (ts - last) / 1000); last = ts;

    for (const w of wishes.value) {
        const phase = (t - w.t0) * (2 * Math.PI * w.freq);
        const speed = Math.max(12, w.speed + w.amp * Math.sin(phase));
        let ang = w.ang + (w.omega + w.wiggle * Math.sin(phase * 0.7)) * dt;

        const pad = w.margin, steer = 1.8;
        if (w.x < pad) ang += steer * dt;
        if (w.x > bounds.w - pad) ang -= steer * dt;
        if (w.y < pad) ang += steer * dt * Math.sign(Math.cos(ang));
        if (w.y > bounds.h - pad) ang -= steer * dt * Math.sign(Math.cos(ang));

        w.x += Math.cos(ang) * speed * dt;
        w.y += Math.sin(ang) * speed * dt;

        w.x = Math.min(Math.max(w.x, pad), Math.max(pad, bounds.w - pad));
        w.y = Math.min(Math.max(w.y, pad), Math.max(pad, bounds.h - pad));

        if (w.x <= pad || w.x >= bounds.w - pad) ang = Math.PI - ang;
        if (w.y <= pad || w.y >= bounds.h - pad) ang = -ang;

        w.ang = ang;
    }

    raf = requestAnimationFrame(tick);
}

/* form */
function openFormAt(e) {
    const r = layer.value.getBoundingClientRect();
    form.value.visible = true;
    form.value.x = Math.min(r.width - 220, Math.max(12, e.clientX - r.left - 100));
    form.value.y = Math.min(r.height - 44, Math.max(12, e.clientY - r.top - 10));
    requestAnimationFrame(() => inp.value?.focus());
}

function closeForm() { form.value.visible = false; val.value = ''; }

function onLayerClick(e) {
    if (form.value.visible) { closeForm(); return; }
    openFormAt(e);
}

async function submit() {
    const word = val.value;
    if (!word) return;

    // fire-and-forget POST
    try {
        await fetch(`${API}/wishes`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ text: word }),
        });
    } catch (_) { /* optional toast */ }

    const pad = 48;
    const x0 = Math.min(Math.max(form.value.x, pad), Math.max(pad, bounds.w - pad));
    const y0 = Math.min(Math.max(form.value.y, pad), Math.max(pad, bounds.h - pad));
    spawn(word, x0, y0);
    closeForm();
}

/* layout */
function measure() {
    const r = layer.value.getBoundingClientRect();
    bounds.w = r.width; bounds.h = r.height;
}

onMounted(() => {
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(layer.value);
    layer.value._ro = ro;

    loadExisting();
    raf = requestAnimationFrame(tick);

    window.addEventListener('keydown', e => { if (e.key === 'Escape') closeForm(); });
});

onBeforeUnmount(() => {
    cancelAnimationFrame(raf);
    layer.value?._ro?.disconnect();
});
</script>

<style scoped>
.layer {
    position: absolute;
    inset: 0;
    pointer-events: auto
}

.wish {
    position: absolute;
    left: 0;
    top: 0;
    font-weight: 700;
    pointer-events: none;
    opacity: 0.8;
    will-change: transform
}

.wish-form {
    position: absolute;
    display: flex;
    gap: 8px;
    padding: 6px 8px;
    background: rgba(15, 15, 20, .9);
    border: 1px solid #333;
    border-radius: 8px;
    z-index: 10
}

.wish-form input {
    width: 160px;
    background: #111;
    color: #eee;
    border: 1px solid #333;
    border-radius: 6px;
    padding: 6px 8px;
    outline: none
}

.wish-form button {
    background: #2b2b2b;
    color: #eee;
    border: 1px solid #444;
    border-radius: 6px;
    padding: 6px 10px;
    cursor: pointer
}
</style>
