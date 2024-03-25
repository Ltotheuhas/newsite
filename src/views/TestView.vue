<template>
  <MasonryWall :items="images" :ssr-columns="1" :column-width="200" :gap="10">
    <template #default="{ item }">
      <div class="image-container" @click="navigateToDetail(item.name)">
        <img :src="item.primary" :alt="`Image of ${item.name}`" class="image"
          @load="event => onImageLoad(event, item)" />
      </div>
    </template>
  </MasonryWall>
</template>

<script>
import MasonryWall from '@yeger/vue-masonry-wall';
import { useRouter } from 'vue-router';
import { defineComponent, ref, onMounted } from 'vue';
import { portfolioItems } from '@/data/portfolioItems';

export default defineComponent({
  components: {
    MasonryWall,
  },
  setup() {
    const router = useRouter();
    const images = ref([]);

    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    };

    onMounted(() => {
      const shuffledItems = [...portfolioItems];
      shuffleArray(shuffledItems);
      images.value = shuffledItems.map(item => ({
        ...item,
      }));
    });

    const onImageLoad = (event, item) => {
      const width = event.target.naturalWidth;
      const height = event.target.naturalHeight;
      const aspectRatio = width / height;
      const imageItem = images.value.find(i => i.name === item.name);
      if (imageItem) {
        imageItem.aspectRatio = aspectRatio;
      }
    };

    const navigateToDetail = (itemId) => {
      router.push({ name: 'details', params: { id: itemId } });
    };

    return { images, navigateToDetail, onImageLoad };
  },
});
</script>

<style scoped>
.image-container {
  width: 100%;
  overflow: hidden;
}

.image {
  max-width: 100%;
  height: auto;
}
</style>
