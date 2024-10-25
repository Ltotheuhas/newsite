<template>
    <div ref="threeContainer" class="three-container"></div>
</template>

<script>
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader.js';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';
// import { X3DLoader } from 'three/examples/jsm/loaders/X3DLoader.js';
import { VRMLLoader } from 'three/examples/jsm/loaders/VRMLLoader.js';
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
            const randomFOV = Math.random() * 50 + 100;
            const camera = new THREE.PerspectiveCamera(randomFOV, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer();

            const radius = 5;
            let angle = 0;
            const rotationSpeed = 0.005;

            const randomYPosition = Math.random() * 9 + 1;
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
                plane.position.set(0, 4, 0);
                scene.add(plane);

                // Animation loop for rotating the image plane
                const animate = () => {
                    requestAnimationFrame(animate);

                    plane.rotation.y += 0.01;
                };
                animate();
            });

            const animate = () => {
                requestAnimationFrame(animate);

                angle += rotationSpeed;
                camera.position.x = Math.cos(angle) * radius;
                camera.position.z = Math.sin(angle) * radius;
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

                const objectPromises = objects.map(obj => {
                    if (obj.type === 'image') {
                        return this.loadImageFromData(obj);
                    } else if (obj.type === 'gif') {
                        return this.loadGIFFromData(obj);
                    } else if (obj.type === 'model') {
                        return this.loadModelFromData(obj);
                    }
                });
                await Promise.all(objectPromises);
            } catch (error) {
                console.error('Error loading objects from backend:', error);
            }
        },
        loadImageFromData(obj) {
            const textureLoader = new THREE.TextureLoader();

            if (obj.filePath) {
                textureLoader.load(
                    `${process.env.VUE_APP_API_URL}${obj.filePath}`,
                    (texture) => {
                        // Check if texture image is loaded properly
                        if (texture.image && texture.image.width && texture.image.height) {
                            const aspect = texture.image.width / texture.image.height;
                            const scale = obj.scale || 2; // Optionally use 'scale' property from obj, default to 2

                            // Create plane geometry and material using the texture
                            const planeGeometry = new THREE.PlaneGeometry(scale, scale / aspect);
                            const planeMaterial = new THREE.MeshBasicMaterial({
                                map: texture,
                                side: THREE.DoubleSide,
                                transparent: true // Enable transparency
                            });

                            // Create and configure the plane mesh
                            const plane = new THREE.Mesh(planeGeometry, planeMaterial);
                            plane.position.copy(obj.position || new THREE.Vector3(0, 0, 0)); // Default position if not set
                            plane.rotation.copy(obj.rotation || new THREE.Euler(0, 0, 0)); // Default rotation if not set

                            this.scene.add(plane); // Add the plane to the scene

                            // Save the object reference for future cleanup
                            this.objects.push(plane);
                        }
                    },
                    undefined
                );
            }
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
        },
        async loadModelFromData(obj) {
            // Extract the file extension from the filePath
            const filePath = obj.filePath;
            const extension = filePath.split('.').pop().toLowerCase(); // Extract extension after last dot

            const loader = this.getLoader(extension);
            if (!loader) {
                return;
            }

            const url = `${process.env.VUE_APP_API_URL}${obj.filePath}`;

            return new Promise((resolve, reject) => {
                loader.load(
                    url,
                    (gltf) => {
                        let sceneObject = gltf.scene ? gltf.scene : gltf;

                        // Set position and rotation
                        sceneObject.position.set(obj.position.x, obj.position.y, obj.position.z);
                        sceneObject.rotation.set(obj.rotation._x, obj.rotation._y, obj.rotation._z, obj.rotation._order);
                        sceneObject.uuid = obj.uuid;

                        // Calculate bounding box and limit the height
                        const boundingBox = new THREE.Box3().setFromObject(sceneObject);
                        const modelHeight = boundingBox.max.y - boundingBox.min.y;
                        const maxHeight = 5; // Set your desired maximum height here

                        // Scale down if the model's height exceeds maxHeight
                        if (modelHeight > maxHeight) {
                            const scale = maxHeight / modelHeight;
                            sceneObject.scale.set(scale, scale, scale);
                        }

                        this.scene.add(sceneObject);
                        resolve(sceneObject);
                    },
                    undefined,
                    (error) => {
                        reject(error);
                    }
                );
            });
        },
        getLoader(extension) {
            switch (extension.toLowerCase()) {
                case 'gltf':
                case 'glb':
                    return new GLTFLoader();
                case 'obj':
                    return new OBJLoader();
                case 'fbx':
                    return new FBXLoader();
                case 'stl':
                    return new STLLoader();
                case 'dae':
                    return new ColladaLoader();
                case '3ds':
                    return new TDSLoader();
                case 'ply':
                    return new PLYLoader();
                /*case 'x3d':
                  return new X3DLoader();*/
                case 'wrl':
                    return new VRMLLoader();
                default:
                    return null;
            }
        }
    }
};
</script>