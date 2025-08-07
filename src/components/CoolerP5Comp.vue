<template>
    <div ref="p5Container" class="p5-container"></div>
</template>

<script>
import p5 from 'p5'

export default {
    name: 'CoolerP5Comp',

    data() {
        return {
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            cellSize: 8,
            grid: null,
            cols: 0,
            rows: 0,
            tick: 0 // frame counter for pacing
        }
    },

    mounted() {
        window.addEventListener('resize', this.onResize)
        this.initP5()
    },

    unmounted() {
        this.p5Instance?.remove()
        window.removeEventListener('resize', this.onResize)
    },

    methods: {
        onResize() {
            this.windowWidth = window.innerWidth
            this.windowHeight = window.innerHeight
            this.resizeCanvas()
            this.initGrid()
        },

        initGrid() {
            if (!this.p5Instance) return
            const p = this.p5Instance
            this.cols = Math.floor(p.width / this.cellSize)
            this.rows = Math.floor(p.height / this.cellSize)
            // sparser seed (≈12% alive)
            this.grid = Array.from({ length: this.cols }, () =>
                Array.from({ length: this.rows }, () => Math.random() < 0.12)
            )
        },

        initP5() {
            const vm = this

            const sketch = (p) => {
                p.setup = () => {
                    const { clientWidth, clientHeight } = vm.$refs.p5Container
                    p.createCanvas(clientWidth, clientHeight)
                    p.noStroke()
                    vm.initGrid()
                }

                p.draw = () => {
                    if (!vm.grid) return

                    p.clear()
                    p.fill(255)
                    for (let x = 0; x < vm.cols; x++) {
                        for (let y = 0; y < vm.rows; y++) {
                            if (vm.grid[x][y]) {
                                p.rect(x * vm.cellSize, y * vm.cellSize, vm.cellSize, vm.cellSize)
                            }
                        }
                    }

                    vm.tick++
                    if (vm.tick >= 1) {
                        vm.tick = 0
                        vm.stepGame()
                    }
                }

                p.windowResized = () => {
                    vm.resizeCanvas()
                    vm.initGrid()
                }
            }

            this.p5Instance = new p5(sketch, this.$refs.p5Container)
            this.resizeCanvas()
        },

        stepGame() {
            const next = Array.from({ length: this.cols }, () => Array(this.rows).fill(false))
            const countNeighbours = (x, y) => {
                let cnt = 0
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (i === 0 && j === 0) continue
                        const cx = (x + i + this.cols) % this.cols
                        const cy = (y + j + this.rows) % this.rows
                        if (this.grid[cx][cy]) cnt++
                    }
                }
                return cnt
            }
            for (let x = 0; x < this.cols; x++) {
                for (let y = 0; y < this.rows; y++) {
                    const alive = this.grid[x][y]
                    const n = countNeighbours(x, y)
                    next[x][y] = alive ? n === 2 || n === 3 : n === 3
                }
            }
            this.grid = next
        },

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
    height: 100%;
    position: relative;
    overflow: hidden;
}

canvas {
    display: block;
}
</style>
