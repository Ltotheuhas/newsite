<template>
  <div class="switch-container" @click="toggleView">
    <img :src="currentGif" alt="Switch GIF" class="switch-gif" ref="switchGif" />
  </div>
  <component :is="selectedComponent" @navigateToDetail="navigateToDetail"></component>
</template>

<script>
import PortfolioGrid from '../components/PortfolioGrid.vue';
import PortfolioList from '../components/PortfolioList.vue';

export default {
  name: 'PortfolioView',

  components: {
    PortfolioGrid,
    PortfolioList,
  },

  data() {
    const isGridView = this.$route.query.view === 'grid';
    return {
      isGridView,
      gifs: {
        grid: require('@/assets/toggle1.gif'),
        list: require('@/assets/toggle2.gif'),
      },
      currentGif: isGridView ? require('@/assets/toggle1.gif') : require('@/assets/toggle2.gif'),
    };
  },

  computed: {
    selectedComponent() {
      return this.isGridView ? 'PortfolioGrid' : 'PortfolioList';
    },
  },

  methods: {
    toggleView() {
      this.isGridView = !this.isGridView;
      this.currentGif = this.isGridView ? this.gifs.grid : this.gifs.list;
      this.updateQuery();
    },
    updateQuery() {
      this.$router.push({ query: { view: this.isGridView ? 'grid' : 'list' } });
    },
  },

  watch: {
    $route(to) {
      this.isGridView = to.query.view === 'grid';
      this.currentGif = this.isGridView ? this.gifs.grid : this.gifs.list;
    },
  },
};
</script>

<style scoped>
.switch-container {
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
}

.switch-gif {
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  width: 100px;
  height: 100px;
}
</style>