<template>
  <MasonryWall :items="images" :ssr-columns="1" :column-width="200" :gap="10">
    <template #default="{ item }">
      <div :style="{ paddingTop: `${(1 / item.aspectRatio) * 100}%` }" class="image-container">
        <img :src="item.url" alt="Image" class="image" />
      </div>
    </template>
  </MasonryWall>
</template>
<script>
import MasonryWall from '@yeger/vue-masonry-wall';
import { defineComponent, ref, nextTick } from 'vue';

export default defineComponent({
  components: {
    MasonryWall,
  },
  setup() {
    const images = ref([]);

    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    };

    const loadImages = () => {
      const gridImageContext = require.context('@/assets/grid/', false, /\.(jpg|jpeg|png|gif)$/);
      const gridImageFilenames = gridImageContext.keys();

      const imageLoadPromises = gridImageFilenames.map((filename) => {
        return new Promise((resolve) => {
          const url = gridImageContext(filename);
          const img = new Image();
          img.onload = () => {
            const aspectRatio = img.naturalWidth / img.naturalHeight;
            resolve({ url, aspectRatio });
          };
          img.src = url;
        });
      });

      Promise.all(imageLoadPromises).then((loadedImages) => {
        shuffleArray(loadedImages); // Shuffle the array of images
        nextTick(() => {
          images.value = loadedImages;
        });
      });
    };

    loadImages();
    return { images };
  },
});
</script>

<style scoped>
.image-container {
  position: relative;
  width: 100%;
}

.image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
