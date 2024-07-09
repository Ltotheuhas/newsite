<template>
  <div class="popup-ad" v-if="visible" :style="positionStyle">
    <div class="title-bar" @mousedown="startDrag" @touchstart="startDrag">
      <div class="title-bar-text">CLICK HERE!</div>
      <div class="title-bar-controls">
        <button aria-label="Close" @click="closeAd"></button>
      </div>
    </div>
    <img :src="currentAdImage.src" alt="ad" class="ad-image" @click="redirect" @contextmenu.prevent @dragstart.prevent />
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      adImages: [
        { src: require('@/assets/ads/antifa.gif'), route: '/writing' },
        { src: require('@/assets/ads/ThongpaseuthKeuakoun.gif'), route: '/portfolio/dataprism' },
      ],
      positionStyle: {
        top: '0px',
        left: '0px',
      },
      currentAdImage: null,
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0,
    };
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

      const randomIndex = Math.floor(Math.random() * this.adImages.length);
      this.currentAdImage = this.adImages[randomIndex];

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
      document.body.classList.add('noselect');

      const touch = event.type === 'touchstart';

      if (touch) {
        this.dragStartX = event.touches[0].clientX - parseInt(this.positionStyle.left);
        this.dragStartY = event.touches[0].clientY - parseInt(this.positionStyle.top);

        document.addEventListener('touchmove', this.onDrag, { passive: false });
        document.addEventListener('touchend', this.stopDrag);
      } else {
        this.dragStartX = event.clientX - parseInt(this.positionStyle.left);
        this.dragStartY = event.clientY - parseInt(this.positionStyle.top);

        document.addEventListener('mousemove', this.onDrag);
        document.addEventListener('mouseup', this.stopDrag);
      }
    },
    onDrag(event) {
      if (!this.isDragging) return;

      event.preventDefault();

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
      document.body.classList.remove('noselect');

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
      if (this.currentAdImage && this.currentAdImage.route) {
        this.$router.push(this.currentAdImage.route);
      }
    },
  },
  mounted() {
    this.scheduleAd();
  },
};
</script>

<style scoped>
@import 'xp.css/dist/XP.css';

.title-bar {
  height: 28px;
}

.title-bar-text {
  font-family: 'Trebuchet MS';
}

.popup-ad {
  position: fixed;
  width: 300px;
  z-index: 1000;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
}

.ad-image {
  width: 100%;
  height: auto;
  user-select: none;
  margin-bottom: -5px;
  cursor: pointer;
}

.noselect {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
}
</style>
