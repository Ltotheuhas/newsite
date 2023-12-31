<template>
    <frame-grid
      class="container"
      :gap="gap"
      defaultDirection="end"
      :frame="frame"
      :rectSize="rectSize"
      :useFrameFill="useFrameFill"
    >
      <div v-for="(image, index) in shuffledImages" :key="index" class="item">
        <img :src="image.url" :alt="'Image ' + index" @click="openImagePage(image)" />
      </div>
    </frame-grid>
  </template>
  
  <script>
  import { FrameGrid } from '@egjs/vue-grid';
  import { useRouter } from 'vue-router';
  
  export default {
    data: () => ({
      gap: 5,
      frame: [[1, 1, 2, 2], [3, 3, 2, 2], [4, 4, 4, 5]],
      rectSize: 0,
      useFrameFill: true,
      images: [], // Array to store image objects
    }),
    components: {
      FrameGrid,
    },
    computed: {
      shuffledImages() {
        // Shuffle the images array to display them in a random order
        return this.shuffleArray(this.images);
      },
    },
    methods: {
      shuffleArray(array) {
        // Shuffle array using Fisher-Yates algorithm
        let currentIndex = array.length,
          randomIndex;
  
        while (currentIndex !== 0) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
  
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
          ];
        }
  
        return array;
      },
      openImagePage(image) {
        // Use the router to navigate to a new page with the image details
        const router = useRouter();
        router.push({
          name: 'ImageDetails',
          params: { id: image.id, text: image.text },
        });
      },
    },
    created() {
      // Load images from the "grid" folder
      const gridImageContext = require.context('@/assets/grid/', false, /\.(jpg|jpeg|png|gif)$/);
      const gridImageFilenames = gridImageContext.keys();
  
      this.images = gridImageFilenames
        .filter(filename => !filename.endsWith('_')) // Exclude images with a trailing underscore
        .map((filename, index) => ({
          id: index, // Add a unique identifier for each image
          url: gridImageContext(filename),
          text: `Custom text for Image ${index}`,
        }));
    },
  };
  </script>
  
  <style scoped>
  .item {
    position: absolute;
    width: 100px;
    text-align: center;
  }
  
  /* Style the images as needed */
  .item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
  }
  </style>
  