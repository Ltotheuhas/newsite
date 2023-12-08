<template>
  <div v-if="smAndUp">
    <div v-for="(image, index) in shuffledImageSources" :key="image.routeName" class="draggable-item"
      @mousedown="startDragging($event, index)" @dragstart="preventNativeDrag" :style="{
        top: `${randomPositions[index].top}px`,
        left: `${randomPositions[index].left}px`,
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
    routeName: 'test',
    images: [],
  },
  {
    routeName: 'comments',
    images: [],
  },
  {
    routeName: 'reveal',
    images: [
      'https://t3.ftcdn.net/jpg/05/76/43/72/360_F_576437228_ZwDb1VwhHVjV0ozQPE3MbWLeOPZT91yg.jpg',
      'https://t4.ftcdn.net/jpg/05/59/60/85/360_F_559608599_nhZNDbdiTCtQ11JSZrkS5tBHPrMF09jn.jpg',
      'https://t3.ftcdn.net/jpg/05/73/66/08/360_F_573660893_CD0DKJ4xRYYQ171LVH1fRpY1XVN6PaKj.jpg',
      // Add more images to the third list as needed
    ],
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

const startDragging = (event, index) => {
  dragging = { index, startX: event.clientX, startY: event.clientY };
  window.addEventListener('mousemove', onDragging);
  window.addEventListener('mouseup', stopDragging);
};

const onDragging = (event) => {
  if (dragging !== null) {
    const { index, startX, startY } = dragging;
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    randomPositions.value[index].left += deltaX;
    randomPositions.value[index].top += deltaY;

    dragging.startX = event.clientX;
    dragging.startY = event.clientY;

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
    window.removeEventListener('mouseup', stopDragging);
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