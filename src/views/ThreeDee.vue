<template>
    <div>
        <div ref="sceneContainer" class="scene-container"></div>
        <WebampPlayer />
    </div>
</template>

<script>
import * as THREE from 'three';
import WebampPlayer from '../components/WebampPlayer.vue';

export default {
    name: 'ThreeDee',
    components: {
        WebampPlayer,
    },
    mounted() {
        this.initThreeJs();
    },
    methods: {
        initThreeJs() {
            const container = this.$refs.sceneContainer;

            // Create a scene
            const scene = new THREE.Scene();

            // Create a camera
            const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
            camera.position.z = 5;

            // Create a renderer
            const renderer = new THREE.WebGLRenderer({ alpha: true }); // Enable transparency
            renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(renderer.domElement);

            // Create a geometry
            const geometry = new THREE.BoxGeometry();

            // Create a material
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

            // Create a mesh
            const cube = new THREE.Mesh(geometry, material);
            scene.add(cube);

            // Animation loop
            const animate = () => {
                requestAnimationFrame(animate);

                // Rotate the cube
                cube.rotation.x += 0.01;
                cube.rotation.y += 0.01;

                renderer.render(scene, camera);
            };

            animate();

            // Handle window resize
            window.addEventListener('resize', () => {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            });
        },
    },
};
</script>

<style scoped>
.scene-container {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background: transparent;
    /* Ensure background is transparent */
    position: relative;
    z-index: 1;
    /* Ensure it is below the WebAmp component */
}

#webamp {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 1000;
    /* Ensure it is above the scene container */
}
</style>
