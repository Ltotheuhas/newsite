<template>
    <v-container class="pa-4">
        <v-card class="pa-4" flat>
            <v-card-title class="text-green text-mono text-h6">You are being watched</v-card-title>
            <v-card-text class="text-green text-mono">
                <template v-if="ipapi.ip">
                    <v-row>
                        <v-col cols="12" md="7">
                            <div><strong>IP:</strong> {{ ipapi.ip }}</div>
                            <div><strong>Visitor:</strong> {{ hitCount }}</div>
                            <div><strong>City:</strong> {{ ipapi.city }}</div>
                            <div><strong>Region:</strong> {{ ipapi.region }}</div>
                            <div><strong>Country:</strong> {{ ipapi.country_name }} ({{ ipapi.country_code }}) {{
                                ipwho.flag?.emoji }}</div>
                            <div><strong>Postal Code:</strong> {{ ipapi.postal }}</div>
                            <div><strong>Latitude:</strong> {{ ipapi.latitude }}</div>
                            <div><strong>Longitude:</strong> {{ ipapi.longitude }}</div>
                            <div><strong>Timezone:</strong> {{ ipapi.timezone }} (UTC {{ ipapi.utc_offset }})</div>
                            <div><strong>Continent:</strong> {{ ipapi.continent_code }}</div>
                            <!--<div><strong>Currency:</strong> {{ ipapi.currency }} ({{ ipapi.currency_name }})</div>
                            <div><strong>Languages:</strong> {{ ipapi.languages }}</div>
                            <div><strong>Capital:</strong> {{ ipapi.country_capital }}</div>
                            <div><strong>Area:</strong> {{ ipapi.country_area }} km²</div>
                            <div><strong>Population:</strong> {{ ipapi.country_population?.toLocaleString?.() }}</div>-->
                            <div><strong>Network:</strong> {{ ipapi.network }}</div>
                            <div><strong>Org:</strong> {{ ipapi.org }}</div>
                            <div><strong>ASN:</strong> {{ ipapi.asn }}</div>
                            <div><strong>ISP Domain:</strong> {{ ipwho.connection?.domain }}</div>
                            <!--<div><strong>Borders:</strong> {{ ipwho.borders }}</div>-->
                            <div><strong>Browser:</strong> {{ browserName }} {{ browserVersion }}</div>
                            <div><strong>OS:</strong> {{ os }}</div>
                            <div><strong>Language:</strong> {{ language }}</div>
                            <div><strong>Screen Size:</strong> {{ screenWidth }} x {{ screenHeight }}</div>
                            <div><strong>Mouse Position:</strong> X: {{ mouseX }} Y: {{ mouseY }}</div>
                        </v-col>

                        <v-col cols="12" md="5">
                            <iframe
                                :src="`https://maps.google.com/maps?q=${ipapi.latitude},${ipapi.longitude}&z=13&output=embed`"
                                width="100%" height="100%" style="border:0;" loading="lazy"
                                referrerpolicy="no-referrer-when-downgrade" />
                        </v-col>
                    </v-row>
                </template>

                <template v-else>
                    <div class="text-yellow">Loading IP data...</div>
                </template>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const ipapi = ref({})
const ipwho = ref({})
const screenWidth = ref(window.innerWidth)
const screenHeight = ref(window.innerHeight)
const mouseX = ref(0)
const mouseY = ref(0)

const browserName = ref('Unknown')
const browserVersion = ref('Unknown')
const os = ref('Unknown')
const language = ref(navigator.language || 'Unknown')

const hitCount = ref(null)

const updateScreenSize = () => {
    screenWidth.value = window.innerWidth
    screenHeight.value = window.innerHeight
}

const trackMouse = (e) => {
    mouseX.value = e.clientX
    mouseY.value = e.clientY
}

const detectBrowser = () => {
    const ua = navigator.userAgent

    if (ua.includes('Firefox')) {
        browserName.value = 'Firefox'
        browserVersion.value = ua.match(/Firefox\/([\d.]+)/)?.[1] || 'Unknown'
    } else if (ua.includes('Chrome')) {
        browserName.value = 'Chrome'
        browserVersion.value = ua.match(/Chrome\/([\d.]+)/)?.[1] || 'Unknown'
    } else if (ua.includes('Safari')) {
        browserName.value = 'Safari'
        browserVersion.value = ua.match(/Version\/([\d.]+)/)?.[1] || 'Unknown'
    }

    if (ua.includes('Windows')) os.value = 'Windows'
    else if (ua.includes('Mac')) os.value = 'macOS'
    else if (ua.includes('Linux')) os.value = 'Linux'
    else if (ua.includes('Android')) os.value = 'Android'
    else if (ua.includes('iPhone') || ua.includes('iPad')) os.value = 'iOS'
}

const fetchData = async () => {
    try {
        const [resApi, resWho] = await Promise.all([
            fetch('https://ipapi.co/json/'),
            fetch('https://ipwho.is/')
        ])
        const dataApi = await resApi.json()
        const dataWho = await resWho.json()
        if (dataApi) ipapi.value = dataApi
        if (dataWho.success) ipwho.value = dataWho
    } catch (err) {
        console.error('Error fetching IP data:', err)
    }
}

const fetchHitCount = async () => {
    try {
        const res = await fetch('https://api.luh.as/hits')
        const data = await res.json()
        hitCount.value = data.hits
    } catch (err) {
        console.error('Failed to fetch hit count:', err)
    }
}

onMounted(() => {
    detectBrowser()
    fetchData()
    fetchHitCount()
    updateScreenSize()
    window.addEventListener('resize', updateScreenSize)
    window.addEventListener('mousemove', trackMouse)
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateScreenSize)
    window.removeEventListener('mousemove', trackMouse)
})
</script>

<style scoped>
.text-mono {
    font-family: 'Courier New', monospace;
}

.text-green {
    color: #00ff66;
}

.text-yellow {
    color: #ffff66;
}
</style>