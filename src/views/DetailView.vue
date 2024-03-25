<template>
  <div v-if="item" class="detail-view">
    <h2>{{ item.name }}</h2>
    <img :src="item.primary" :alt="`Primary image of ${item.name}`" class="primary-image" />
    <div v-if="item.secondary && item.secondary.length" class="secondary-images">
      <img v-for="(image, index) in item.secondary" :key="index" :src="image" :alt="`Secondary image of ${item.name} ${index}`" />
    </div>
    <p>{{ item.description }}</p>
  </div>
  <div v-else>
    <p>Item not found.</p>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { portfolioItems } from '@/data/portfolioItems'; 

export default {
  setup() {
    const route = useRoute();
    const item = ref(null);

    onMounted(() => {
      // Use 'id' to match the route parameter name
      const itemId = route.params.id; // Changed from itemName to itemId
      const foundItem = portfolioItems.find(i => i.name === itemId);
      if (foundItem) {
        item.value = foundItem; // No need to require images here if paths are correctly set up in portfolioItems.js
      }
    });

    return { item };
  },
};
</script>

<style scoped>
.detail-view {
  text-align: center;
}

.primary-image, .secondary-images img {
  max-width: 100%;
  height: auto;
  margin-bottom: 20px;
}
</style>
