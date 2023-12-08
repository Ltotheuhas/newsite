<template>
  <v-app-bar app color="#080808" elevation="0" class="nav">
    <router-link to="/" class="mx-auto">
      <img :src="require(`../assets/logo.svg`)" to="/" class="navmg" />
    </router-link>
  </v-app-bar>
</template>

<script>
export default {
  name: 'NavbarComp',
}
</script>

<style>
.nav {
  height: 69px;
  border-bottom: 1px solid white;
  z-index: 666;
}

.navmg {
  height: 49px;
  margin-top: 11.3px;
}
</style>