<template>
  <div ref="threeContainer" class="three-container"></div>
</template>

<script>
/* eslint-disable no-console */
import * as THREE from 'three';
import { parseGIF, decompressFrames } from 'gifuct-js';

export default {
  name: 'ThreeJSAdScene',

  data() {
    return {
      objects: []               // we push every mesh we add (optional)
    };
  },

  async mounted() {
    await this.initThreeJS();    // sets this.scene / camera / renderer
    await this.loadObjectsFromBackend();
    this.camera.rotation.order = 'YXZ';
  },

  methods: {
    /* -------------------------------------------------------------- */
    /*  THREE-JS SET-UP                                              */
    /* -------------------------------------------------------------- */
    async initThreeJS() {
      const el = this.$refs.threeContainer;

      /* --- create core objects and expose them immediately ------- */
      const scene = new THREE.Scene();
      const fov = 80 + Math.random() * 30;
      const camera = new THREE.PerspectiveCamera(
        fov,
        el.clientWidth / el.clientHeight,
        0.1,
        1000
      );
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(el.clientWidth, el.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0xffffff, 1);
      el.appendChild(renderer.domElement);

      /*  make them available to the rest of the component NOW  */
      Object.assign(this, { scene, camera, renderer });

      /* --- simple lighting / helpers ------------------------ */
      scene.add(new THREE.AmbientLight(0xffffff, 1));
      scene.add(new THREE.GridHelper(20, 20));
      scene.add(new THREE.AxesHelper(5));

      /* --- spinning Megaworld splash ------------------------ */
      new THREE.TextureLoader().load(
        require('@/assets/megaworld.png'),
        tex => {
          const asp = tex.image.width / tex.image.height;
          const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(4, 4 / asp),
            new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide })
          );
          plane.position.set(0, 2, 0);
          scene.add(plane);

          const spin = () => {
            plane.rotation.y += 0.01;
            requestAnimationFrame(spin);
          };
          spin();
        }
      );

      /* --- randomised camera orbit -------------------------- */
      const RADIUS = 5;
      const SPEED = 0.005;
      const FREQ = 0.5 + Math.random() * 2;
      const AMP = 2;
      const Y_BASE = 1 + Math.random() * 4;
      let angle = Math.random() * Math.PI * 2;
      let t = 0;

      const animate = () => {
        requestAnimationFrame(animate);
        t += SPEED;
        angle += SPEED;

        camera.position.set(
          Math.cos(angle) * RADIUS,
          Y_BASE + Math.sin(t * FREQ) * AMP,
          Math.sin(angle) * RADIUS
        );
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
      };
      animate();

      /* --- handle resizes ----------------------------------- */
      window.addEventListener('resize', () => {
        const { clientWidth: w, clientHeight: h } = el;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      });
    },

    /* -------------------------------------------------------------- */
    /*  FETCH OBJECTS FROM BACKEND & DISPATCH LOADERS                */
    /* -------------------------------------------------------------- */
    async loadObjectsFromBackend() {
      const api = process.env.VUE_APP_API_URL;
      try {
        const res = await fetch(`${api}/objects`);
        const list = await res.json();

        /* nearest-first so foreground appears quickly */
        list.sort((a, b) => this.dist(a.position) - this.dist(b.position));

        const BATCH = 5, DELAY = 500;
        for (let i = 0; i < list.length; i += BATCH) {
          await Promise.all(
            list.slice(i, i + BATCH).map(o =>
              o.type === 'image' ? this.loadImageFromData(o)
                : this.loadGIFFromData(o)
            )
          );
          await new Promise(r => setTimeout(r, DELAY));
        }
      } catch (err) {
        console.error('Error loading objects:', err);
      }
    },
    dist(p = {}) { return Math.hypot(p.x || 0, p.y || 0, p.z || 0); },

    /* -------------------------------------------------------------- */
    /*  IMAGE PLANE                                                  */
    /* -------------------------------------------------------------- */
    loadImageFromData(obj) {
      const loader = new THREE.TextureLoader();
      const api = process.env.VUE_APP_API_URL;
      const url = `${api}${obj.filePaths.small || obj.filePaths.original}`;

      loader.load(
        url,
        tex => {
          const asp = tex.image.width / tex.image.height;
          const size = obj.scale || 2;
          const geo = new THREE.PlaneGeometry(size, size / asp);
          const mat = new THREE.MeshBasicMaterial({
            map: tex, transparent: true, side: THREE.DoubleSide
          });
          const mesh = new THREE.Mesh(geo, mat);
          mesh.position.copy(obj.position);
          mesh.rotation.copy(obj.rotation);
          this.scene.add(mesh);
          this.objects.push(mesh);
        },
        undefined,
        err => console.error('Image load error:', err)
      );
    },

    /* -------------------------------------------------------------- */
    /*  GIF PLANE                                                    */
    /* -------------------------------------------------------------- */
    async loadGIFFromData(obj) {
      const api = process.env.VUE_APP_API_URL;
      const resp = await fetch(`${api}${obj.filePaths.original}`);
      const buf = await resp.arrayBuffer();
      const gif = parseGIF(buf);
      const fr = decompressFrames(gif, true);

      const cvs = document.createElement('canvas');
      cvs.width = fr[0].dims.width;
      cvs.height = fr[0].dims.height;
      const ctx = cvs.getContext('2d');
      const tex = new THREE.CanvasTexture(cvs);
      const asp = cvs.width / cvs.height;

      const geo = new THREE.PlaneGeometry(2, 2 / asp);
      const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(obj.position);
      mesh.rotation.copy(obj.rotation);
      this.scene.add(mesh);
      this.objects.push(mesh);

      /* simple frame player */
      let i = 0;
      const play = () => {
        const f = fr[i];
        ctx.putImageData(
          new ImageData(new Uint8ClampedArray(f.patch), f.dims.width, f.dims.height),
          f.dims.left, f.dims.top
        );
        tex.needsUpdate = true;
        i = (i + 1) % fr.length;
        setTimeout(() => requestAnimationFrame(play), (f.delay || 10) * 10);
      };
      play();
    }
  }
};
</script>

<style scoped>
.three-container {
  position: absolute;
  overflow: hidden;
}
</style>
