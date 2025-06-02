<template>
    <div ref="threeContainer" class="three-container"></div>
</template>

<script>
import * as THREE from 'three';
import { parseGIF, decompressFrames } from 'gifuct-js';

export default {
    name: 'ThreeJSScene',
    data() {
        return {
            objects: [],
            canvas: document.createElement('canvas'),
            ctx: null,
            frames: [],
            frameIndex: 0,
            playing: true,
        };
    },
    mounted() {
        this.initThreeJS().then(() => {
            this.loadObjectsFromBackend();
            this.camera.rotation.order = 'YXZ';
        });
    },
    methods: {
        async initThreeJS() {
            // Setup
            const container = this.$refs.threeContainer;
            const scene = new THREE.Scene();
            const randomFOV = Math.random() * 30 + 80;
            const camera = new THREE.PerspectiveCamera(randomFOV, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer();

            const radius = 5;
            let angle = Math.random() * Math.PI * 2;
            const rotationSpeed = 0.005;

            const randomFrequency = Math.random() * 2 + 0.5;
            const amplitude = 2;
            let time = 0;
            const randomYPosition = Math.random() * 4 + 1;

            camera.position.set(Math.cos(angle) * radius, randomYPosition, Math.sin(angle) * radius);
            camera.lookAt(0, 0, 0);

            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setClearColor(0xffffff, 1); // White background
            container.appendChild(renderer.domElement);

            // Lighting
            const light = new THREE.AmbientLight(0xffffff); // white light
            scene.add(light);

            // Grid Helper
            const gridHelper = new THREE.GridHelper(20, 20);
            scene.add(gridHelper);

            // Axes Helper
            const axesHelper = new THREE.AxesHelper(5);
            scene.add(axesHelper);

            // Load Megaworld Image
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(require('@/assets/megaworld.png'), (texture) => {
                const aspect = texture.image.width / texture.image.height;
                const planeGeometry = new THREE.PlaneGeometry(4, 4 / aspect);
                const planeMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
                const plane = new THREE.Mesh(planeGeometry, planeMaterial);
                plane.position.set(0, 2, 0);
                scene.add(plane);

                // Animation loop for rotating the image plane
                const animatePlane = () => {
                    requestAnimationFrame(animatePlane);
                    plane.rotation.y += 0.01;
                };
                animatePlane();
            });

            // Animation loop for rotating the camera
            const animate = () => {
                requestAnimationFrame(animate);

                time += rotationSpeed;
                angle += rotationSpeed;
                camera.position.x = Math.cos(angle) * radius;
                camera.position.z = Math.sin(angle) * radius;
                camera.position.y = randomYPosition + Math.sin(time * randomFrequency) * amplitude; // Apply sine wave to Y position

                camera.lookAt(0, 0, 0);
                renderer.render(scene, camera);
            };
            animate();

            this.scene = scene;
            this.camera = camera;
            this.renderer = renderer;
        },
        async loadObjectsFromBackend() {
            const apiUrl = process.env.VUE_APP_API_URL;
            try {
                const response = await fetch(`${apiUrl}/objects`);
                const objects = await response.json();

                objects.sort((a, b) => this.getDistanceFromOrigin(a) - this.getDistanceFromOrigin(b));

                const batchSize = 5;
                const delayBetweenBatches = 500;

                for (let i = 0; i < objects.length; i += batchSize) {
                    const batch = objects.slice(i, i + batchSize);
                    const objectPromises = batch.map(obj => {
                        if (obj.type === 'image') {
                            return this.loadImageFromData(obj);
                        } else if (obj.type === 'gif') {
                            return this.loadGIFFromData(obj);
                        }
                    });

                    await Promise.all(objectPromises);
                    await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
                }
            } catch (error) {
                console.error('Error loading objects from backend:', error);
            }
        },
        getDistanceFromOrigin(obj) {
            if (obj.position) {
                const { x, y, z } = obj.position;
                return Math.sqrt(x * x + y * y + z * z);
            }
            return Infinity;
        },
        loadImageFromData(obj) {
            const textureLoader = new THREE.TextureLoader();
            // Use the '-small.webp' version of the image
            const imageUrl = `${process.env.VUE_APP_API_URL}${obj.filePath.replace(/\.[^/.]+$/, '-small.webp')}`;

            textureLoader.load(
                imageUrl,
                (texture) => {
                    const aspect = texture.image.width / texture.image.height;
                    const scale = obj.scale || 2;

                    const planeGeometry = new THREE.PlaneGeometry(scale, scale / aspect);
                    const planeMaterial = new THREE.MeshBasicMaterial({
                        map: texture,
                        side: THREE.DoubleSide,
                        transparent: true
                    });

                    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
                    plane.position.copy(obj.position || new THREE.Vector3(0, 0, 0));
                    plane.rotation.copy(obj.rotation || new THREE.Euler(0, 0, 0));

                    this.scene.add(plane);
                    this.objects.push(plane);
                },
                undefined,
                (err) => {
                    console.error('Error loading image texture:', err);
                }
            );
        },
        async loadGIFFromData(obj) {
            const response = await fetch(`${process.env.VUE_APP_API_URL}${obj.filePath}`);
            const arrayBuffer = await response.arrayBuffer();
            const gif = parseGIF(arrayBuffer);
            const frames = decompressFrames(gif, true);

            // Create a canvas for rendering the GIF
            const canvas = document.createElement('canvas');
            canvas.width = frames[0].dims.width;
            canvas.height = frames[0].dims.height;
            const ctx = canvas.getContext('2d');

            const texture = new THREE.CanvasTexture(canvas);
            const aspect = canvas.width / canvas.height;
            const planeGeometry = new THREE.PlaneGeometry(2, 2 / aspect);
            const planeMaterial = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide,
                transparent: true // Enable transparency
            });
            const plane = new THREE.Mesh(planeGeometry, planeMaterial);

            // Set position and rotation based on the object data
            plane.position.copy(obj.position || new THREE.Vector3(0, 0, 0));
            plane.rotation.copy(obj.rotation || new THREE.Euler(0, 0, 0));

            this.scene.add(plane);
            this.objects.push(plane);

            // Animate the GIF frames
            let frameIndex = 0;

            const animateGIF = () => {
                // Check for the delay of the current frame
                const frame = frames[frameIndex];
                const delayIsInMilliseconds = frame.delay < 10 ? false : true;
                const frameDelay = delayIsInMilliseconds ? frame.delay : frame.delay * 10;

                ctx.putImageData(
                    new ImageData(
                        new Uint8ClampedArray(frame.patch),
                        frame.dims.width,
                        frame.dims.height
                    ),
                    frame.dims.left,
                    frame.dims.top
                );
                texture.needsUpdate = true;

                frameIndex = (frameIndex + 1) % frames.length;
                setTimeout(() => {
                    requestAnimationFrame(animateGIF);
                }, frameDelay);
            };

            animateGIF();
        }
    }
};
</script>