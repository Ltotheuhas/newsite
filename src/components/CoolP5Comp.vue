<template>
    <div ref="p5Container" class="p5-container"></div>
</template>

<script>
import p5 from 'p5'

export default {
    name: 'CoolP5CompEnhanced',

    data() {
        return {
            scrollY: 0,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight
        }
    },

    mounted() {
        window.addEventListener('scroll', this.onScroll, { passive: true })
        window.addEventListener('resize', this.onResize)

        this.initP5()
    },

    unmounted() {
        this.p5Instance?.remove()
        window.removeEventListener('scroll', this.onScroll)
        window.removeEventListener('resize', this.onResize)
    },

    methods: {
        onScroll() {
            this.scrollY = window.scrollY
        },
        onResize() {
            this.windowWidth = window.innerWidth
            this.windowHeight = window.innerHeight
            this.resizeCanvas()
        },

        initP5() {
            const vm = this

            const sketch = (p) => {
                let nX = 0
                let nY = 10000
                const MAX_GLITCH = 150
                const SHAPE_DISTANCE = 150
                const BASE_RADIUS = 40

                p.setup = () => {
                    const { clientWidth, clientHeight } = vm.$refs.p5Container
                    p.createCanvas(clientWidth, clientHeight)
                    p.noFill()
                }

                p.draw = () => {
                    p.clear()

                    // ---- reactive inputs ----
                    const now = new Date()
                    const secFrac = now.getSeconds() + now.getMilliseconds() / 1000
                    const scrollNorm = p.constrain(vm.scrollY / (vm.windowHeight || 1), 0, 1)

                    // ---- mapping ----
                    const glitchNoise = p.map(p.noise(nX), 0, 1, 0, MAX_GLITCH)
                    const glitch = glitchNoise * (1 + scrollNorm)

                    const distNoise = p.map(p.noise(nY), 0, 1, SHAPE_DISTANCE, 0)
                    const dist = distNoise + Math.sin(secFrac * p.TWO_PI / 60) * 30

                    nX += 0.01
                    nY += 0.01

                    p.push()
                    p.translate(p.width / 2, p.height / 2)

                    p.stroke(255)
                    p.strokeWeight(2)

                    const drawShape = (dx) => {
                        p.push()
                        p.translate(dx, 0)
                        p.beginShape()
                        const sides = Math.max(5, Math.floor(vm.windowWidth / 300))
                        for (let i = 0; i < sides; i++) {
                            const a = (p.TWO_PI / sides) * i
                            const r = BASE_RADIUS + p.random(-glitch, glitch)
                            p.vertex(p.cos(a) * r, p.sin(a) * r)
                        }
                        p.endShape(p.CLOSE)
                        p.pop()
                    }

                    drawShape(-dist / 2)
                    drawShape(dist / 2)
                    p.pop()
                }

                p.windowResized = () => vm.resizeCanvas()
            }

            this.p5Instance = new p5(sketch, this.$refs.p5Container)
            this.resizeCanvas()
        },

        /** Resize canvas to match the container, respecting devicePixelRatio. */
        resizeCanvas() {
            if (!this.p5Instance) return
            const { clientWidth: w, clientHeight: h } = this.$refs.p5Container
            const dpr = window.devicePixelRatio || 1
            this.p5Instance.resizeCanvas(w, h, false)
            this.p5Instance.pixelDensity(dpr)
        }
    }
}
</script>

<style scoped>
.p5-container {
    width: 100%;
    height: 800px;
    position: relative;
    overflow: hidden;
}
</style>
