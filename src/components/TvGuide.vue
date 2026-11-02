<template>
  <section class="tv-guide" aria-label="LuhasTV programme guide">
    <header class="guide-header">
      <div>
        <h2>PROGRAM GUIDE</h2>
        <p v-if="current">
          <strong>Now:</strong> {{ current.title }}
          <span v-if="current.subtitle"> — {{ current.subtitle }}</span>
        </p>
        <p v-if="next"><strong>Next:</strong> {{ next.title }} at {{ time(next.start) }}</p>
      </div>
    </header>

    <p v-if="error" class="guide-message" role="alert">{{ error }}</p>
    <p v-else-if="loading && !programs.length" class="guide-message">Loading schedule…</p>

    <div v-if="programs.length" class="guide-scroll">
      <div class="timeline">
        <div v-for="tick in ticks" :key="tick.at" class="tick" :style="{ left: tick.left + '%' }">
          <span>{{ time(tick.at) }}</span>
        </div>

        <div v-for="item in visible" :key="item.key" class="programme"
          :class="{ active: item.start <= now && now < item.end }"
          :style="{ left: item.left + '%', width: item.width + '%' }"
          :title="`${item.title}${item.subtitle ? ' — ' + item.subtitle : ''}\n${time(item.start)}–${time(item.end)}${item.description ? '\n' + item.description : ''}`">
          <strong>{{ item.title }}</strong>
          <small v-if="item.subtitle">{{ item.subtitle }}</small>
          <span>{{ time(item.start) }} – {{ time(item.end) }}</span>
        </div>

        <div class="now-marker" :style="{ left: nowLeft + '%' }" aria-label="Current time">
          <span>NOW</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const GUIDE_URL = '/tv-guide.xml'
const CHANNEL_ID = 'C1.49.tunarr.com'
const HALF_HOUR = 30 * 60 * 1000
const WINDOW_LENGTH = 4 * 60 * 60 * 1000

const programs = ref([])
const loading = ref(true)
const error = ref('')
const now = ref(Date.now())
let clockTimer
let refreshTimer

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit', minute: '2-digit'
})
const time = (timestamp) => timeFormatter.format(new Date(timestamp))

// XMLTV uses YYYYMMDDHHmmss ±HHMM. Convert to a UTC timestamp.
function parseXmltvDate(value) {
  const m = String(value || '').match(
    /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})\s*([+-])(\d{2})(\d{2})/
  )
  if (!m) return NaN
  const utc = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6])
  const minutes = +m[8] * 60 + +m[9]
  return utc - (m[7] === '+' ? 1 : -1) * minutes * 60000
}

async function loadGuide() {
  try {
    const response = await fetch(GUIDE_URL, { cache: 'no-store' })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const xml = new DOMParser().parseFromString(await response.text(), 'application/xml')
    if (xml.getElementsByTagName('parsererror').length) {
      throw new Error('Invalid XMLTV response')
    }
    const textOf = (node, tag) => node.getElementsByTagName(tag)[0]?.textContent?.trim() || ''
    const parsed = Array.from(xml.getElementsByTagName('programme'))
      .filter(node => node.getAttribute('channel') === CHANNEL_ID)
      .map(node => ({
        start: parseXmltvDate(node.getAttribute('start')),
        end: parseXmltvDate(node.getAttribute('stop')),
        title: textOf(node, 'title') || 'Untitled',
        subtitle: textOf(node, 'sub-title'),
        description: textOf(node, 'desc')
      }))
      .filter(p => Number.isFinite(p.start) && Number.isFinite(p.end) && p.end > p.start)
      .sort((a, b) => a.start - b.start)
    if (!parsed.length) throw new Error('No programmes found for LuhasTV')
    programs.value = parsed
    error.value = ''
  } catch (e) {
    error.value = `Could not load the programme guide: ${e.message}`
  } finally {
    loading.value = false
  }
}

const current = computed(() => programs.value.find(p => p.start <= now.value && now.value < p.end))
const next = computed(() => programs.value.find(p => p.start > now.value))
const start = computed(() => Math.floor(now.value / HALF_HOUR) * HALF_HOUR - HALF_HOUR)
const end = computed(() => start.value + WINDOW_LENGTH)
const nowLeft = computed(() => (now.value - start.value) / WINDOW_LENGTH * 100)
const ticks = computed(() => Array.from({ length: 8 }, (_, i) => ({
  at: start.value + i * HALF_HOUR,
  left: i * HALF_HOUR / WINDOW_LENGTH * 100
})))
const visible = computed(() => programs.value
  .filter(p => p.end > start.value && p.start < end.value)
  .map(p => ({
    ...p,
    key: `${p.start}-${p.title}`,
    left: (Math.max(start.value, p.start) - start.value) / WINDOW_LENGTH * 100,
    width: (Math.min(end.value, p.end) - Math.max(start.value, p.start)) / WINDOW_LENGTH * 100
  })))

onMounted(() => {
  loadGuide()
  clockTimer = setInterval(() => { now.value = Date.now() }, 15000)
  refreshTimer = setInterval(loadGuide, 5 * 60 * 1000)
})
onBeforeUnmount(() => {
  clearInterval(clockTimer)
  clearInterval(refreshTimer)
})
</script>

<style scoped>
.tv-guide {
  margin-top: 24px;
  color: #f1f3f5;
  border-radius: 13px;
  font-family: inherit;
}

.guide-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 16px;
}

.guide-header h2 {
  margin: 0 0 10px;
  font-size: 1.2rem;
  letter-spacing: .07em;
}

.guide-header p {
  margin: 4px 0;
  font-size: .85rem;
  color: #c3cbd3;
}

.guide-header strong {
  color: #fff;
}

.live-label {
  flex: none;
  color: #2dc2cf;
  font-weight: 800;
  letter-spacing: .05em;
}

.guide-message {
  padding: 12px;
  color: #f2bd91;
}

.guide-scroll {
  overflow-x: auto;
  padding-bottom: 9px;
}

.timeline {
  position: relative;
  height: 168px;
  min-width: 1050px;
}

.tick {
  position: absolute;
  top: 0;
  bottom: 5px;
  border-left: 1px solid #515a62;
  padding-left: 7px;
  color: #d1d8de;
  font-size: .9rem;
}

.programme {
  position: absolute;
  top: 43px;
  height: 99px;
  box-sizing: border-box;
  background: #527b7d;
  border: 2px solid #15191e;
  border-radius: 5px;
  padding: 9px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.programme:nth-of-type(3n) {
  background: #836979;
}

.programme:nth-of-type(4n) {
  background: #65816d;
}

.programme.active {
  background: #a78073;
}

.programme strong,
.programme small,
.programme span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.programme strong {
  font-size: .86rem;
}

.programme small {
  font-size: .75rem;
  opacity: .9;
}

.programme span {
  font-size: .72rem;
  margin-top: auto;
}

.now-marker {
  position: absolute;
  top: 27px;
  height: 122px;
  border-left: 3px solid #2dc2cf;
  pointer-events: none;
  z-index: 2;
}

.now-marker span {
  position: absolute;
  top: -25px;
  left: -19px;
  color: #07181a;
  background: #2dc2cf;
  font-size: .65rem;
  padding: 5px 7px;
  border-radius: 5px;
  font-weight: 800;
}

@media (max-width: 650px) {
  .tv-guide {
    padding: 14px;
  }

  .guide-header {
    flex-direction: column;
    gap: 6px;
  }
}
</style>
