<template>
  <div ref="p5Container" class="p5-container"></div>
</template>

<script>
import p5 from 'p5'

export default {
  name: 'CoolerP5Comp',

  mounted() {
    this.initP5()
  },

  unmounted() {
    this.p5Instance?.remove()
  },

  methods: {
    initP5() {
      const sketch = (p) => {
        const NODE_COUNT = 24   // drastically fewer points
        const CONNECTIONS = 1    // minimal linking

        p.setup = () => {
          const { clientWidth, clientHeight } = this.$refs.p5Container
          p.createCanvas(clientWidth, clientHeight)
          p.noFill()
          p.stroke(255, 140)      // subtle alpha
          p.strokeCap(p.ROUND)
          p.frameRate(30)         // light on resources
        }

        p.draw = () => {
          p.clear()

          const t = p.frameCount * 0.005 // very slow evolution

          // precompute node positions
          const pts = new Array(NODE_COUNT)
          for (let i = 0; i < NODE_COUNT; i++) {
            const nx = p.noise(i * 0.2, t)
            const ny = p.noise(i * 0.2 + 100, t)
            pts[i] = {
              x: nx * p.width,
              y: ny * p.height
            }
          }

          // draw faint connections
          for (let i = 0; i < NODE_COUNT; i++) {
            const a = pts[i]
            p.strokeWeight(0.7)
            for (let k = 1; k <= CONNECTIONS; k++) {
              const j = (i + k) % NODE_COUNT // simple next‑node link for gentle path
              const b = pts[j]
              p.line(a.x, a.y, b.x, b.y)
            }
          }
        }

        p.windowResized = () => {
          const { clientWidth, clientHeight } = this.$refs.p5Container
          p.resizeCanvas(clientWidth, clientHeight)
        }
      }

      this.p5Instance = new p5(sketch, this.$refs.p5Container)
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
