<template>
    <div
      class="popup-ad"
      v-if="visible"
      :style="positionStyle"
    >
      <div
        class="popup-header"
        @mousedown="startDrag"
        @touchstart="startDrag"
      >
        <span>Advertisement</span>
        <button @click="closeAd" class="close-button">X</button>
      </div>
      <img
        :src="randomAdImage.src"
        :alt="randomAdImage.alt"
        class="ad-image"
        @click="redirect"
        @contextmenu.prevent
        @dragstart.prevent
      />
    </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      adImages: [
        { src: require('@/assets/ads/antifa.gif'), alt: 'Antifa Ad', route: '/writing' },
      ],
      positionStyle: {
        top: '0px',
        left: '0px',
      },
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0,
    };
  },
  computed: {
    randomAdImage() {
      const randomIndex = Math.floor(Math.random() * this.adImages.length);
      return this.adImages[randomIndex];
    },
  },
  methods: {
    showAd() {
      if (this.visible) return;

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const randomTop = Math.floor(Math.random() * (windowHeight - 200)) + 'px';
      const randomLeft = Math.floor(Math.random() * (windowWidth - 300)) + 'px';

      this.positionStyle.top = randomTop;
      this.positionStyle.left = randomLeft;

      //this.visible = true;
    },
    closeAd() {
      this.visible = false;
    },
    scheduleAd() {
      setTimeout(() => {
        this.showAd();
        this.scheduleAd();
      }, Math.random() * 30000 + 10000);
    },
    startDrag(event) {
      this.isDragging = true;
      const touch = event.type === 'touchstart';

      if (touch) {
        this.dragStartX = event.touches[0].clientX - parseInt(this.positionStyle.left);
        this.dragStartY = event.touches[0].clientY - parseInt(this.positionStyle.top);

        document.addEventListener('touchmove', this.onDrag);
        document.addEventListener('touchend', this.stopDrag);
      } else {
        this.dragStartX = event.clientX - parseInt(this.positionStyle.left);
        this.dragStartY = event.clientX - parseInt(this.positionStyle.top);

        document.addEventListener('mousemove', this.onDrag);
        document.addEventListener('mouseup', this.stopDrag);
      }
    },
    onDrag(event) {
      if (!this.isDragging) return;

      const touch = event.type === 'touchmove';

      if (touch) {
        this.positionStyle.left = event.touches[0].clientX - this.dragStartX + 'px';
        this.positionStyle.top = event.touches[0].clientY - this.dragStartY + 'px';
      } else {
        this.positionStyle.left = event.clientX - this.dragStartX + 'px';
        this.positionStyle.top = event.clientY - this.dragStartY + 'px';
      }
    },
    stopDrag(event) {
      this.isDragging = false;

      const touch = event.type === 'touchend';

      if (touch) {
        document.removeEventListener('touchmove', this.onDrag);
        document.removeEventListener('touchend', this.stopDrag);
      } else {
        document.removeEventListener('mousemove', this.onDrag);
        document.removeEventListener('mouseup', this.stopDrag);
      }
    },
    redirect() {
      const randomAdImage = this.randomAdImage;
      if (randomAdImage.route) {
        this.$router.push(randomAdImage.route);
      }
    },
  },
  mounted() {
    this.scheduleAd();
  },
};
</script>

<style scoped>
.popup-ad {
  position: fixed;
  width: 300px;
  border: 2px solid #000;
  background-color: #fff;
  z-index: 1000;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ccc;
  padding: 5px;
  border-bottom: 1px solid #000;
  cursor: move;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

.ad-image {
  width: 100%;
  height: auto;
  user-select: none;
}
</style>