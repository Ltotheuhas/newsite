<!-- src/components/CircleText.vue -->
<template>
    <v-sheet :style="{ width: size + 'px', height: size + 'px' }" class="d-flex align-center justify-center"
        elevation="0">
        <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" class="circle-text"
            :style="spin ? { animation: `rotate ${duration}s linear infinite` } : {}">
            <defs>
                <path :id="pathId" :d="circlePath" />
            </defs>

            <text :fill="color" :font-size="fontSize" :font-family="fontFamily"
                style="letter-spacing:2px;text-transform:uppercase">
                <textPath :xlink:href="`#${pathId}`" startOffset="0%">
                    {{ text }}
                </textPath>
            </text>
        </svg>
    </v-sheet>
</template>

<script>
import { computed } from 'vue'

export default {
    name: 'CircleText',
    props: {
        text: { type: String, required: true },
        radius: { type: Number, default: 75 },
        size: { type: Number, default: 200 },
        color: { type: String, default: 'black' },
        fontSize: { type: Number, default: 18 },
        fontFamily: { type: String, default: 'sans-serif' },
        spin: { type: Boolean, default: true },
        duration: { type: Number, default: 10 },
    },
    setup(props) {
        // generate a stable ID once per component instance
        const pathId = 'circle-path-' + Math.random().toString(36).slice(2)

        // SVG arc path that represents a full circle
        const circlePath = computed(() => {
            const r = props.radius
            return `M ${props.size / 2},${props.size / 2}
              m -${r},0
              a ${r},${r} 0 1,1 ${r * 2},0
              a ${r},${r} 0 1,1 -${r * 2},0`
        })

        return { pathId, circlePath }
    },
}
</script>

<style scoped>
@keyframes rotate {
    to {
        transform: rotate(360deg);
    }
}

.circle-text {
    transform-origin: center;
}
</style>
