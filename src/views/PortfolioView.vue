<template>
  <div class="switch-container">
    <v-switch v-model="isGridView" :label="isGridView ? 'Grid View' : 'List View'" inset></v-switch>
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
    return {
      isGridView: false,
    };
  },

  computed: {
    selectedComponent() {
      return this.isGridView ? 'PortfolioGrid' : 'PortfolioList';
    },
  },
};
</script>

<style scoped>
.switch-container {
  position: absolute;
  top: 16px;
  right: 16px;
}
</style>
