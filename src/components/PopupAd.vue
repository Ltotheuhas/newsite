<template>
  <div class="popup-ad" v-if="visible" :style="positionStyle">
    <div class="title-bar" @mousedown="startDrag" @touchstart="startDrag">
      <div class="title-bar-text">{{ currentAdImage.title }}</div>
      <div class="title-bar-controls">
        <button aria-label="Close" @click="closeAd"></button>
      </div>
    </div>

    <template v-if="currentAdImage.type === '3D'">
      <div class="popup-ad threed pointer" @click="redirect">
        <ThreeJSAdScene class="three-ad" />
      </div>
    </template>

    <template v-else-if="currentAdImage.type === 'erdstall'">
      <div class="pointer" @click="redirect">
        <ErdStall class="ad-image" />
      </div>
    </template>

    <img v-else :src="currentAdImage.src" alt="ad"
      :class="{ 'ad-image': true, 'pointer': currentAdImage.route || currentAdImage.url }" @click="redirect"
      @contextmenu.prevent @dragstart.prevent />
  </div>
</template>

<script>
import ThreeJSAdScene from './ThreeJSAdScene.vue';
import ErdStall from './ErdStall.vue';

export default {
  components: {
    ThreeJSAdScene,
    ErdStall
  },
  data() {
    return {
      visible: false,
      adImages: [
        { src: require('@/assets/ads/antifa.gif'), route: '/writing', title: "CLICK HERE TO KILL A NAZI!" },
        { src: require('@/assets/ads/ThongpaseuthKeuakoun.gif'), title: "ຂ້າ​ເຂົາ​ເຈົ້າ​ທັງ​ຫມົດ 1999​" },
        { src: require('@/assets/ads/lefthandpath.png'), title: "I WANT TO FUCK RAINBOW DASH" },
        { src: require('@/assets/ads/crazyguy.jpg'), title: "KILL PPL BRN SHYT FCK SKOOL" },
        { src: require('@/assets/ads/dragon.gif'), title: "look at this cool car" },
        //{ src: require('@/assets/ads/firstone.gif'), title: "REACHES THRU UR COMPUTR SCREEN" },
        { src: require('@/assets/ads/Mereana.webp'), title: "YOU WILL DIE IN 3 DAYS" },
        { src: require('@/assets/ads/peopleshit.gif'), title: "╭∩╮（︶︿︶）╭∩╮" },
        { src: require('@/assets/ads/tesseract.gif'), route: '/threedee', title: "ESCAPE THE SECOND DIMENSION" },
        { src: require('@/assets/ads/kvlt.png'), title: "A DEVOID DYING SUN" },
        //{ src: require('@/assets/ads/changelog.webp'), route: '/shapes', title: "Changelog" },
        { src: require('@/assets/ads/hard.png'), url: 'https://youtu.be/xBrxROap_n8?si=GCzypjySN44nNqPA', title: "listen to this song its dope af" },
        { src: require('@/assets/ads/harakiri.jpg'), title: "SD LAIKA APPRECIATION WEBSITE" },
        { type: '3D', title: "ESCAPE", url: 'https://3d.megaworld.xyz' },
        { src: require('@/assets/ads/psyops.jpg'), title: "YOUR DESIRES ARE COMPROMISED" },
        { src: require('@/assets/ads/cd.jpg'), title: "CD OUT NOW", route: '/store/8d60a87f-8037-41be-b424-9ac23955940d' },
        { type: 'erdstall', title: 'KEIN GOTT KEIN STAAT', url: 'https://erdstall.luh.as', news: true },
      ],
      positionStyle: {
        top: '0px',
        left: '0px',
      },
      currentAdImage: null,
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0,
      newsAdShown: false,
      adTimeoutId: null,
    };
  },
  methods: {
    showAd() {
      if (this.visible) return;

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const randomTop = Math.floor(Math.random() * (windowHeight - 264)) + 64 + 'px';
      const randomLeft = Math.floor(Math.random() * (windowWidth - 364)) + 64 + 'px';

      this.positionStyle.top = randomTop;
      this.positionStyle.left = randomLeft;

      if (this.newsAdShown) {
        const newsAd = this.adImages.find(ad => ad.news);
        if (newsAd) {
          this.currentAdImage = newsAd;
        } else {
          this.selectRandomAd();
        }
      } else {
        this.selectRandomAd();
      }

      this.visible = true;
    },
    selectRandomAd() {
      const randomAds = this.adImages;
      const randomIndex = Math.floor(Math.random() * randomAds.length);
      this.currentAdImage = randomAds[randomIndex];
    },
    closeAd() {
      this.visible = false;
      if (this.newsAdShown) {
        this.newsAdShown = false;
      }
    },
    scheduleAd() {
      if (this.adTimeoutId) {
        clearTimeout(this.adTimeoutId);
      }
      this.adTimeoutId = setTimeout(() => {
        this.showAd();
        this.scheduleAd();
      }, Math.random() * 800000 + 120000);
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
      if (this.currentAdImage) {
        if (this.currentAdImage.route) {
          this.$router.push(this.currentAdImage.route);
          this.closeAd();
        } else if (this.currentAdImage.url) {
          window.open(this.currentAdImage.url, '_blank');
          this.closeAd();
        }
      }
    },
  },
  mounted() {
    const newsAd = this.adImages.find(ad => ad.news);

    this.$watch('$route', (to) => {
      if (to.name) {
        if (newsAd && this.$route.name === 'home') {
          this.currentAdImage = newsAd;
          this.newsAdShown = true;
          this.showAd();
        } else {
          this.scheduleAd();
        }
      }
    });
  },
};
</script>

<style scoped>
.popup-ad {
  position: fixed;
  width: 300px;
  z-index: 1000;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
}

.popup-ad .threed {
  position: relative;
  height: 300px;
}

.three-ad {
  width: 100%;
  height: 100%;
}

.title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(180deg, #0997ff, #0053ee 8%, #0050ee 40%, #06f 88%, #06f 93%, #005bff 95%, #003dd7 96%, #003dd7);
  padding: 3px 5px 3px 3px;
  border-top: 1px solid #0831d9;
  border-left: 1px solid #0831d9;
  border-right: 1px solid #001ea0;
  border-top-left-radius: 8px;
  border-top-right-radius: 7px;
  font-size: 13px;
  text-shadow: 1px 1px #0f1089;
  height: 28px;
}

.title-bar-text {
  font-family: 'Trebuchet MS';
  padding-left: 3px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0;
  margin-right: 24px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
}

.title-bar-controls {
  display: flex;

}

.title-bar-controls button[aria-label=Close] {
  background-image: url("close.svg");
}

.title-bar-controls button {
  padding: 0;
  display: block;
  min-width: 21px;
  min-height: 21px;
  margin-left: 2px;
  background-repeat: no-repeat;
  background-position: 50%;
  box-shadow: none;
  background-color: #0050ee;
  transition: background .1s;
  border: none;
}

.ad-image {
  width: 100%;
  height: auto;
  user-select: none;
  margin-bottom: -7px;
}

.pointer {
  cursor: pointer;
}

.noselect {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
}

@media (max-width: 600px) {
  .popup-ad {
    width: 240px;
  }

  .popup-ad .threed {
    height: 240px;
  }
}
</style>
