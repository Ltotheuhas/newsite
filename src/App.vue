<template>
  <v-app>
    <audio ref="globalAudio" :src="radioStreamUrl" preload="none" crossorigin="anonymous"
      style="display: none;"></audio>
    <NavbarComp />
    <PopupAd v-if="showPopupAd" />
    <div :class="['main-content', { 'has-radio-bar': showNowPlaying }]">
      <v-main>
        <div :class="{ 'mainStuff': !reveal, 'hidden': reveal }">
          <router-view />
        </div>
        <RandomImage :numImages="randomNumImages" :class="{ 'randomimage': !reveal, 'revealed': reveal }" />
      </v-main>
    </div>
    <FooterComp />
    <div class="sticky-neko">
      <WebNeko />
    </div>
  </v-app>
</template>

<script>
import { ref, watch, computed, onMounted, provide } from 'vue';
import { useRoute } from 'vue-router';
import NavbarComp from './components/NavbarComp.vue';
import FooterComp from './components/FooterComp.vue';
import RandomImage from './components/RandomImage.vue';
import PopupAd from '@/components/PopupAd.vue';
import WebNeko from './components/WebNeko.vue';

export default {
  name: 'App',

  components: {
    NavbarComp,
    FooterComp,
    RandomImage,
    PopupAd,
    WebNeko,
  },

  setup() {
    const randomNumImages = ref(1);
    const route = useRoute();
    const reveal = ref(false);

    const generateRandomNumImages = () => {
      const min = 1;
      const max = 50;
      randomNumImages.value = Math.floor(Math.random() * (max - min + 1)) + min;
    };

    generateRandomNumImages();

    watch(() => route.name, (newRoute) => {
      reveal.value = newRoute === 'reveal';
    });

    const showPopupAd = computed(() => !route.path.startsWith('/store'));
    const isHome = computed(() => route.name === 'home');
    const isRadio = computed(() => route.name === 'radio');

    const radioStreamUrl = "https://radio.luh.as/stream.mp3";

    // The global <audio> element reference
    const globalAudio = ref(null);

    // Basic audio states
    const isMuted = ref(true);
    const volume = ref(0);

    const nowPlaying = ref({
      artist: "",
      title: "",
    });

    const showNowPlaying = computed(() => {
      return !isMuted.value && (nowPlaying.value.artist || nowPlaying.value.title) && !isHome.value && !isRadio.value;
    });


    onMounted(() => {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);
    });

    // Provide these so child components can inject them
    provide("globalAudio", globalAudio);
    provide("isMuted", isMuted);
    provide("volume", volume);
    provide("nowPlaying", nowPlaying);
    provide("showNowPlaying", showNowPlaying);

    return {
      randomNumImages,
      generateRandomNumImages,
      reveal,
      showPopupAd,
      radioStreamUrl,
      globalAudio,
      isMuted,
      volume,
      nowPlaying,
      showNowPlaying
    };
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Play:wght@400;700&display=swap');

@font-face {
  font-family: 'Cabazon';
  src: url('Cabazon.ttf');
}

* {
  font-family: 'Play', sans-serif;
  scrollbar-width: thin;
  scrollbar-color: #ffffff #000000;
}

*::-webkit-scrollbar {
  width: 2px;
}

*::-webkit-scrollbar-track {
  background: #000000;
  opacity: 50%;
}

*::-webkit-scrollbar-thumb {
  background-color: #ffffff;
  border-radius: 0px;
  border: 0px none #ffffff;
}

.mainStuff {
  padding: 30px 20px;
  position: relative;
  z-index: 1;
  height: 100%;
}

.randomimage {
  filter: invert(1) grayscale(100%) blur(6px) brightness(33%) saturate(0%) opacity(76%) contrast(154%);
  -webkit-filter: invert(1) grayscale(100%) blur(6px) brightness(33%) saturate(0%) opacity(76%) contrast(154%);
  -moz-filter: invert(1) grayscale(100%) blur(6px) brightness(33%) saturate(0%) opacity(76%) contrast(154%);
  pointer-events: none;
}

.v-btn {
  background-color: white;
  color: black;
  opacity: 80%;
}

.hidden {
  display: none;
}

.revealed img {
  pointer-events: all;
}

.sticky-neko {
  position: fixed;
  z-index: 1100;
}

.v-main {
  transition: margin-top 0.5s;
}

.has-radio-bar {
  margin-top: 15px;
  /* Push down same as the now-playing bar height */
}
</style>
