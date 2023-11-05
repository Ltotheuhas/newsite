<template>
  <div>
    <div class="mainStuff px-6">
      <CommentComp></CommentComp>
    </div>
    <RandomImage :numImages="randomNumImages" class="randomimage" />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import RandomImage from '../components/RandomImage.vue';
import CommentComp from '../components/CommentComp.vue';

export default defineComponent({
  name: 'HomeView',

  components: {
    RandomImage,
    CommentComp,
  },

  setup() {
    const randomNumImages = ref(1); // Initialize with 1 image

    const generateRandomNumImages = () => {
      const min = 1;
      const max = 50;
      randomNumImages.value = Math.floor(Math.random() * (max - min + 1)) + min;
    };

    generateRandomNumImages();

    return {
      randomNumImages,
      generateRandomNumImages,
    };
  },
});
</script>


<style>
.randomimage {
  filter: grayscale(100%) blur(6px) brightness(49%) saturate(0%) opacity(76%) contrast(154%);
  -webkit-filter: grayscale(100%) blur(6px) brightness(49%) saturate(0%) opacity(76%) contrast(154%);
  -moz-filter: grayscale(100%) blur(6px) brightness(49%) saturate(0%) opacity(76%) contrast(154%);
}

.hcb-icon,
.home-desc,
.hcb-like {
  display: none;
}

.hcb-shadow-r {
  background-color: white;
  opacity: 80%;
  border-radius: 3px;
}

.btn {
  border-radius: 3px;
}

.commentbox {
  resize: none;
  width: 600px !important;
}

.mainStuff {
  position: relative;
  z-index: 1;
}
</style>
