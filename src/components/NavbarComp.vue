<template>
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
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '../stores/cartStore';

export default {
  name: 'NavbarComp',
  setup() {
    const route = useRoute();
    const cartStore = useCartStore();

    const isStorePage = computed(() => route.path === '/store');

    const cartItemCount = computed(() =>
      cartStore.items.reduce((total, item) => total + item.quantity, 0)
    );

    return { isStorePage, cartItemCount };
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
</style>
