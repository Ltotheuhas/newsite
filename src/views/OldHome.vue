<template>
  <div v-if="smAndUp">
    <div v-for="(image, index) in shuffledImageSources" :key="image.routeName" class="draggable-item"
      @mousedown="startDragging($event, index)" @touchstart="startDragging($event, index)" @dragstart="preventNativeDrag"
      :style="{
        top: `${randomPositions[index].top}px`,
        left: `${randomPositions[index].left}px`,
        zIndex: randomPositions[index] && randomPositions[index].z ? randomPositions[index].z : 0,
      }">
      <router-link v-show="!isDraggingVisible && totalDistance < clickThreshold" :to="`/${image.routeName}`">
        <img :src="image.url" alt="Draggable Image" class="draggable-image" />
      </router-link>
      <img v-show="isDraggingVisible || totalDistance >= clickThreshold" :src="image.url" class="draggable-image" />
    </div>
  </div>
  <div v-if="xs">
    <v-row class="mx-auto" style="width: 80%;">
      <v-col v-for="(imageSource, index) in shuffledImageSources" :key="index" cols="12" sm="6" md="4">
        <router-link :to="`/${imageSource.routeName}`">
          <img class="gridmg" :src="imageSource.url" />
        </router-link>
      </v-col>
    </v-row>
  </div>
</template>
  
<script setup>
import { ref } from 'vue';
import { useDisplay } from 'vuetify';
const { xs, smAndUp } = useDisplay();

const imageLists = [
  {
    routeName: 'myspace',
    images: [],
  },
  {
    routeName: 'comments',
    images: [],
  },
  {
    routeName: 'reveal',
    images: [],
  },
];

const meImageContext = require.context('@/assets/me/', false, /\.jpg$/);
const meImageFilenames = meImageContext.keys();
const meImages = meImageFilenames.map((filename) => {
  return {
    name: filename,
    url: meImageContext(filename),
  };
});
imageLists[0].images = meImages;

const youImageContext = require.context('@/assets/you/', false, /\.jpg$/);
const youImageFilenames = youImageContext.keys();
const youImages = youImageFilenames.map((filename) => {
  return {
    name: filename,
    url: youImageContext(filename),
  };
});
imageLists[1].images = youImages;

const otherImageContext = require.context('@/assets/other/', false, /\.jpg$/);
const otherImageFilenames = otherImageContext.keys();
const otherImages = otherImageFilenames.map((filename) => {
  return {
    name: filename,
    url: otherImageContext(filename),
  };
});
imageLists[2].images = otherImages;

const shuffledImageLists = imageLists.map(({ routeName, images }) => ({
  routeName,
  url: images.sort(() => Math.random() - 0.5)[0].url,
}));

const shuffledImageSources = ref(
  shuffledImageLists.map(({ routeName, url }) => ({ routeName, url }))
);

shuffledImageSources.value.sort(() => Math.random() - 0.5);

const randomPositions = ref([]);

const getRandomImages = () => {
  for (let i = 0; i < shuffledImageSources.value.length; i++) {
    randomPositions.value[i] = generateRandomPosition();
  }
};

const generateRandomPosition = () => {
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;
  const maxTop = windowHeight - 400;
  const maxLeft = windowWidth - 400;

  const randomTop = Math.floor(Math.random() * maxTop);
  const randomLeft = Math.floor(Math.random() * maxLeft);

  return { top: randomTop, left: randomLeft };
};

let dragging = null;

const isDraggingVisible = ref(false);
let totalDistance = 0;
let clickThreshold = 5;
const highestZIndex = ref(0);

const startDragging = (event, index) => {
  const clientX = event.touches ? event.touches[0].clientX : event.clientX;
  const clientY = event.touches ? event.touches[0].clientY : event.clientY;

  dragging = { index, startX: clientX, startY: clientY };
  window.addEventListener('mousemove', onDragging);
  window.addEventListener('touchmove', onDragging);
  window.addEventListener('mouseup', stopDragging);
  window.addEventListener('touchend', stopDragging);

  highestZIndex.value++;
  randomPositions.value[index].z = highestZIndex.value;
};

const onDragging = (event) => {
  if (dragging !== null) {
    const { index } = dragging;

    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;

    const deltaX = clientX - dragging.startX;
    const deltaY = clientY - dragging.startY;

    randomPositions.value[index].left += deltaX;
    randomPositions.value[index].top += deltaY;

    dragging.startX = clientX;
    dragging.startY = clientY;

    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    totalDistance += distance;

    if (totalDistance >= clickThreshold) {
      isDraggingVisible.value = true;
    }
  }
};

const stopDragging = () => {
  if (dragging !== null) {
    window.removeEventListener('mousemove', onDragging);
    window.removeEventListener('touchmove', onDragging);
    window.removeEventListener('mouseup', stopDragging);
    window.removeEventListener('touchend', stopDragging);
    dragging = null;
    totalDistance = 0;
    isDraggingVisible.value = false;
  }
};

const preventNativeDrag = (event) => {
  event.preventDefault();
};

getRandomImages();
</script>
  
<style scoped>
.draggable-item {
  position: absolute;
  cursor: grab;
}

.draggable-image {
  max-height: 400px;
  max-width: 400px;
  object-fit: cover;
}

img.gridmg {
  width: 100%;
}
</style>