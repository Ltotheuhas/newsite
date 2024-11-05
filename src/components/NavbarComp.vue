<template>
  <v-app-bar app color="#080808" elevation="0" class="nav">
    <div class="logo-container">
      <router-link to="/" class="logo-link">
        <img :src="require(`../assets/logo.svg`)" class="navmg" />
      </router-link>
    </div>
    <v-btn v-if="isStorePage" icon to="/store/cart" class="cart-icon">
      <v-icon>mdi-cart</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'NavbarComp',
  setup() {
    const route = useRoute();

    const isStorePage = computed(() => route.path === '/store');

    return { isStorePage };
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
  margin-top: 6px;
}

.cart-icon {
  position: absolute;
  right: 16px;
}
</style>
