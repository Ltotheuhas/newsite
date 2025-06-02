<template>
  <!-- The main navbar -->
  <v-app-bar app color="#080808" elevation="0" class="nav">
    <div class="logo-container">
      <router-link to="/" class="logo-link">
        <img :src="require(`../assets/logo.svg`)" class="navmg" />
      </router-link>
    </div>
    <v-btn v-if="isStorePage" icon to="/store/cart" :ripple="false" class="cart-icon">
      <v-badge v-if="cartItemCount > 0" :content="cartItemCount" color="#202020" style="filter: invert(1);" overlap>
        <v-icon color="black">mdi-cart</v-icon>
      </v-badge>
      <v-icon v-else color="white">mdi-cart</v-icon>
    </v-btn>
  </v-app-bar>
  <div class="now-playing-bar" :class="{ show: showNowPlaying }">
    <div class="scrolling-text" v-if="showNowPlaying">
      <span class="mx-12" v-for="n in 1000" :key="n">
        Now playing: {{ decodedNowPlaying }}
      </span>
    </div>
  </div>

</template>

<script>
import { computed, inject } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '../stores/cartStore';

export default {
  name: 'NavbarComp',
  setup() {
    const route = useRoute();
    const cartStore = useCartStore();

    const isStorePage = computed(() => route.path.startsWith('/store'));

    const cartItemCount = computed(() =>
      cartStore.items.reduce((total, item) => total + item.quantity, 0)
    );

    // We'll assume your home route name is 'home'
    const isHome = computed(() => route.name === 'home');

    // Inject the radio states
    const isMuted = inject("isMuted");           // e.g. ref(boolean)
    const nowPlaying = inject("nowPlaying");     // e.g. ref({ artist, title })

    const showNowPlaying = computed(() => {
      return !isHome.value &&
        !isMuted.value &&
        (nowPlaying.value.artist || nowPlaying.value.title);
    });

    const decodeHtml = (html) => {
      const textarea = document.createElement("textarea");
      textarea.innerHTML = html;
      return textarea.value;
    };

    const decodedNowPlaying = computed(() => {
      return nowPlaying.value
        ? decodeHtml(nowPlaying.value.artist) + " - " + decodeHtml(nowPlaying.value.title)
        : "idk x_x";
    });

    return {
      isStorePage,
      cartItemCount,
      isHome,
      isMuted,
      nowPlaying,
      showNowPlaying,
      decodedNowPlaying
    };
  },
};
</script>

<style>
.nav {
  height: 69px;
  border-bottom: 1px solid white;
  z-index: 666;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.logo-container {
  display: flex;
  justify-content: center;
  flex: 1;
}

.navmg {
  height: 49px;
  margin-top: 10px;
}

.cart-icon {
  position: absolute;
  right: 10px;
  background: transparent !important;
}

.now-playing-bar {
  background-color: white;
  color: black;
  overflow: hidden;
  height: 0;
  transition: height 0.5s, border-bottom 0.5s;
  border-bottom: 0 solid white;
}

/* When we show it, let’s make the bar e.g. 40px tall, and border thicker. */
.now-playing-bar.show {
  height: 15px;
  margin-top: 68.5px;
  position: fixed;
  z-index: 1008;
  width: 100%;
}

/* The text that scrolls inside the bar. We do a marquee style. */
.scrolling-text {
  white-space: nowrap;
  font-size: 1rem;
  line-height: 15px;
  font-family: monospace, Arial, sans-serif;
  /* Ensures consistent text display */
  direction: ltr;
  /* Prevents characters from being flipped */
  unicode-bidi: bidi-override;
  /* Fixes RTL character issues */
  animation: marquee 40s linear infinite;
}

/* The marquee animation from right-to-left. */
@keyframes marquee {
  0% {
    transform: translateX(100%);
  }

  100% {
    transform: translateX(-100%);
  }
}
</style>