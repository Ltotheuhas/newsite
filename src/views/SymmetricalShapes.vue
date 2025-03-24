<template>
  <div ref="p5Container" class="p5-container"></div>
</template>

<script>
import p5 from 'p5';

export default {
  name: 'KlyftInspired',
  mounted() {
    this.initP5();
  },
  methods: {
    initP5() {
      const sketch = (p) => {
        let noiseOffsetX = 0;
        let noiseOffsetY = 10000;
        const maxGlitch = 200;
        const shapeDistance = 200;

        p.setup = () => {
          p.createCanvas(p.windowWidth, p.windowHeight);
          p.clear();  // Ensure the initial canvas is clear (transparent)
        };

        p.draw = () => {
          p.clear();  // Clear the canvas on each frame for transparency
          p.stroke(255); // Set stroke color to white
          p.noFill(); // Ensure shapes are not filled

          // Generate noise-based values for smooth movement
          const glitchAmount = p.map(p.noise(noiseOffsetX), 0, 1, 0, maxGlitch);
          const distance = p.map(p.noise(noiseOffsetY), 0, 1, shapeDistance, 0);

          // Update noise offsets for smooth transition
          noiseOffsetX += 0.01;
          noiseOffsetY += 0.01;

          p.push();
          p.translate(p.width / 2, p.height / 2);

          // Left shape
          p.push();
          p.translate(-distance / 2, 0);
          p.beginShape();
          for (let i = 0; i < 8; i++) {
            const angle = p.TWO_PI / 8 * i;
            const x = p.cos(angle) * (50 + p.random(-glitchAmount, glitchAmount));
            const y = p.sin(angle) * (50 + p.random(-glitchAmount, glitchAmount));
            p.vertex(x, y);
          }
          p.endShape(p.CLOSE);
          p.pop();

          // Right shape
          p.push();
          p.translate(distance / 2, 0);
          p.beginShape();
          for (let i = 0; i < 8; i++) {
            const angle = p.TWO_PI / 8 * i;
            const x = p.cos(angle) * (50 + p.random(-glitchAmount, glitchAmount));
            const y = p.sin(angle) * (50 + p.random(-glitchAmount, glitchAmount));
            p.vertex(x, y);
          }
          p.endShape(p.CLOSE);
          p.pop();

          p.pop();
        };

        p.windowResized = () => {
          p.resizeCanvas(p.windowWidth, p.windowHeight);
        };
      };

      new p5(sketch, this.$refs.p5Container);
    },
  },
};
</script>

<style scoped>
.p5-container {
  width: 100vw;
  /* Full viewport width */
  height: 100vh;
  /* Full viewport height */
  overflow: hidden;
  position: fixed;
  /* Fixed position to cover the entire screen */
  top: 0;
  left: 0;
  z-index: -1;
  /* Ensure it stays behind other content */
}
</style>