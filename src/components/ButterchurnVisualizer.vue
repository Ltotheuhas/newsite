<template>
    <canvas ref="visualizerCanvas" class="visualizer-container"></canvas>
</template>

<script>
import butterchurn from "butterchurn";
import * as butterchurnPresets from "butterchurn-presets"; // Import all presets

export default {
    name: "ButterchurnVisualizer",
    props: {
        audioContext: {
            type: Object,
            required: true,
        },
        audioSource: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            visualizer: null,
        };
    },
    mounted() {
        this.initVisualizer();
    },
    beforeUnmount() {
        if (this.visualizer) {
            this.visualizer = null;
        }
    },
    methods: {
        initVisualizer() {
            const canvas = this.$refs.visualizerCanvas;

            if (!canvas || !canvas.getContext) {
                console.error("Canvas not found or invalid");
                return;
            }

            // Create the Butterchurn visualizer
            this.visualizer = butterchurn.createVisualizer(this.audioContext, canvas, {
                width: canvas.offsetWidth,
                height: canvas.offsetHeight,
                pixelRatio: window.devicePixelRatio || 1,
            });

            // Access the presets and load a random one
            const presets = butterchurnPresets.getPresets();
            const presetKeys = Object.keys(presets);
            const randomPreset = presets[presetKeys[Math.floor(Math.random() * presetKeys.length)]];
            this.visualizer.loadPreset(randomPreset, 2.0);

            // Connect the audio source
            this.visualizer.connectAudio(this.audioSource);

            // Start rendering
            this.renderLoop();
        },
        renderLoop() {
            if (this.visualizer) {
                this.visualizer.render();
                requestAnimationFrame(this.renderLoop);
            }
        },
        resizeVisualizer() {
            if (this.visualizer) {
                const canvas = this.$refs.visualizerCanvas;
                this.visualizer.setRendererSize(canvas.offsetWidth, canvas.offsetHeight);
            }
        },
    },
};
</script>