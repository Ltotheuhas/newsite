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
            move: {
                forward: false,
                backward: false,
                left: false,
                right: false,
            },
            touchStart: { x: 0, y: 0 },
            yaw: 0, // Horizontal rotation (left/right)
            pitch: 0, // Vertical rotation (up/down)
            pitchLimit: Math.PI / 3, // Restrict pitch to a comfortable limit (e.g., 60 degrees)
            objects: [],
            canvas: document.createElement('canvas'),
            ctx: null,
            frames: [],
            frameIndex: 0,
            playing: true,
        };
    },
    props: {
        joystickX: {
            type: Number,
            default: 0,
        },
        joystickY: {
            type: Number,
            default: 0,
        }
    },
    mounted() {
        this.initThreeJS().then(() => {
            this.loadObjectsFromBackend();
            this.setupPeriodicUpdate();
            this.camera.rotation.order = 'YXZ';
        });
    },
    beforeUnmount() {
        // Cleanup event listeners
        window.removeEventListener('resize', this.checkOrientation);
        window.removeEventListener('orientationchange', this.checkOrientation);
        document.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('keyup', this.onKeyUp);
        document.removeEventListener('touchstart', this.onTouchStart);
        document.removeEventListener('touchmove', this.onTouchMove);

        // Remove keydown event listener
        window.removeEventListener('keydown', this.handleKeydown);
    },
    methods: {
        async initThreeJS() {
            // Setup
            const container = this.$refs.threeContainer;
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
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

            const move = this.move;
            let movementSpeed = 10; // Adjust base movement speed

            const onKeyDown = (event) => {
                switch (event.key) {
                    case 'ArrowUp':
                    case 'w':
                    case 'W':
                        move.forward = true;
                        break;
                    case 'ArrowDown':
                    case 's':
                    case 'S':
                        move.backward = true;
                        break;
                    case 'ArrowLeft':
                    case 'a':
                    case 'A':
                        move.left = true;
                        break;
                    case 'ArrowRight':
                    case 'd':
                    case 'D':
                        move.right = true;
                        break;
                    case '+':
                    case '=': // Often found in combination with shift for +
                        movementSpeed += 2;
                        console.log(`Increased movement speed: ${movementSpeed}`);
                        break;
                    case '-':
                    case '_': // Often found in combination with shift for -
                        movementSpeed = Math.max(2, movementSpeed - 2);
                        console.log(`Decreased movement speed: ${movementSpeed}`);
                        break;
                }
            };

            const onKeyUp = (event) => {
                switch (event.key) {
                    case 'ArrowUp':
                    case 'w':
                    case 'W':
                        move.forward = false;
                        break;
                    case 'ArrowDown':
                    case 's':
                    case 'S':
                        move.backward = false;
                        break;
                    case 'ArrowLeft':
                    case 'a':
                    case 'A':
                        move.left = false;
                        break;
                    case 'ArrowRight':
                    case 'd':
                    case 'D':
                        move.right = false;
                        break;
                }
            };

            document.addEventListener('keydown', onKeyDown);
            document.addEventListener('keyup', onKeyUp);

            const animate = () => {
                requestAnimationFrame(animate);

                renderer.render(scene, camera);
            };
            animate();

            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });

            camera.position.set(0, 2, 5);

            this.scene = scene;
            this.camera = camera;
            this.renderer = renderer;
        },
        async loadObjectsFromBackend() {
            const apiUrl = process.env.VUE_APP_API_URL;
            try {
                const response = await fetch(`${apiUrl}/objects`);

                if (!response.ok) {
                    console.error('Error status:', response.status, response.statusText);
                    throw new Error('Failed to load objects from backend');
                }

                const objects = await response.json();
                console.log('Loaded objects:', objects);

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
            console.log('Loading image from data:', obj);

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

                            console.log(`Image ${obj.filePath} loaded and added to the scene.`);
                        } else {
                            console.error('Texture image dimensions unavailable for:', obj.filePath);
                        }
                    },
                    undefined,
                    (err) => {
                        console.error(`Error loading texture from ${obj.filePath}:`, err);
                    }
                );
            } else {
                console.error('No file path found for image object:', obj);
            }
        },
        async loadGIFFromData(obj) {
            console.log('Loading GIF from data:', obj);

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

            console.log(`GIF ${obj.filePath} loaded and added to the scene.`);
        },
        async loadModelFromData(obj) {
            console.log('Loading model from data:', obj); // Debugging log

            // Extract the file extension from the filePath
            const filePath = obj.filePath;
            const extension = filePath.split('.').pop().toLowerCase(); // Extract extension after last dot

            const loader = this.getLoader(extension);
            if (!loader) {
                console.error(`No loader available for extension: ${extension}`);
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
                        console.error('Error loading model:', error);
                        reject(error);
                    }
                );
                console.log(`Model ${obj.filePath} loaded and added to the scene.`);
            });
        },
        getLoader(extension) {
            console.log(`getLoader called with extension: ${extension}`); // Add logging
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
                    console.error(`Unsupported model file type: ${extension}`);
                    return null;
            }
        }
    }
};
</script>