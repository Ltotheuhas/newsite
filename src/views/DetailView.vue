<template>
  <div v-if="item" class="detail-view">
    <div class="year-display" v-if="item.year">{{ item.year }}</div>
    <div v-if="item.type === 'clothes'" class="clothes-container">
      <img :src="item.primary" :alt="`${item.name}`" class="primary-image" />
      <img v-if="item.secondary && item.secondary.length" :src="item.secondary[0]" :alt="`${item.name} secondary 0`"
        class="secondary-image" />
      <div class="additional-secondary-images" v-if="item.secondary && item.secondary.length > 1">
        <img v-for="(image, index) in item.secondary.slice(1)" :key="index" :src="image"
          :alt="`${item.name} secondary ${index + 1}`" />
      </div>
    </div>
    <div v-else>
      <img :src="item.primary" :alt="`${item.name}`" class="primary-image" />
      <div v-if="item.secondary && item.secondary.length" class="secondary-images">
        <img v-for="(image, index) in item.secondary" :key="index" :src="image"
          :alt="`${item.name} secondary ${index}`" />
      </div>
    </div>
    <div class="description">
      <span v-for="(part, index) in normalizedDescription" :key="index">
        <template v-if="part.type === 'html'">
          <span v-html="part.content"></span>
        </template>
        <template v-else-if="part.type === 'link'">
          <a :href="part.href" target="_blank" rel="noopener noreferrer">{{ part.content }}</a>
        </template>
        <template v-else>
          {{ part.content }}
        </template>
      </span>
    </div>
    <div v-if="item.embedUrls && item.embedUrls.length" class="video-embed">
      <div class="video-container" v-for="(url, index) in item.embedUrls" :key="index">
        <iframe :src="url" frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen></iframe>
      </div>
    </div>
    <div v-if="item.bcembed && item.bcembed.length" class="ma-auto">
      <iframe class="bcembed"
        :src="`https://bandcamp.com/EmbeddedPlayer/album=${item.bcembed}/size=large/bgcol=333333/linkcol=ffffff/artwork=none/transparent=true/`"
        seamless allow="encrypted-media"></iframe>
    </div>
  </div>
  <div class="detail-view" v-else>
    <img :src="require('@/assets/404.gif')" loading="lazy">
    <h2>oopsieeeee !!!!!! &gt;////////////&lt;</h2>
    <p>it seem liek there is nothing here..... empty web page.....</p>
    <p>الورشة بالفشل</p>
  </div>
  <p class="back">
    <router-link class="back" to="/test">back</router-link>
  </p>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { portfolioItems } from '@/data/portfolioItems';

export default {
  setup() {
    const route = useRoute();
    const item = ref(null);

    onMounted(() => {
      const itemId = route.params.id;
      const foundItem = portfolioItems.find(i => i.name === itemId);
      if (foundItem) {
        item.value = foundItem;
      }
    });

    const normalizedDescription = computed(() => {
      const description = item.value?.description;
      if (typeof description === 'string') {
        return [{ type: 'html', content: description }];
      } else if (Array.isArray(description)) {
        return description;
      }
      return [];
    });

    return { item, normalizedDescription };
  },
};
</script>

<style scoped>
.detail-view {
  text-align: center;
  padding-top: 15px;
}

.primary-image,
.secondary-images img {
  max-width: 100%;
  max-height: 700px;
  margin-bottom: 20px;
}

.video-embed {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: auto;
}

.video-container {
  width: 50%;
  margin-bottom: 20px;
  position: relative;
  padding-top: 28.125%;
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.description {
  font-size: 20px;
  width: 52%;
  margin: 0 auto 20px;
}

.back {
  color: lightgray;
  margin: auto;
  width: fit-content;
}

.back:hover {
  text-decoration: line-through;
}

.description {
  width: 100%;
}

.year-display {
  position: absolute;
  top: 0;
  left: 0;
  margin: 15px;
  letter-spacing: 2rem;
  font-style: italic;
}

.bcembed {
  border: 0;
  width: 100%;
  max-width: 480px;
  height: 210px;
}

@media only screen and (max-width: 992px) {
  .video-container {
    width: 75%;
    padding-top: 42.1875%;
  }
}

@media only screen and (max-width: 576px) {
  .video-container {
    width: 100%;
    padding-top: 56.25%;
  }
}
</style>

<style>
.description a {
  color: lightgray;
}

.description a:hover {
  text-decoration: line-through;
}

.clothes-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.clothes-container .primary-image,
.clothes-container .secondary-image {
  max-width: 45%;
  margin: 5px;
}

.additional-secondary-images {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.additional-secondary-images img {
  max-width: 45%;
  margin: 5px;
}

@media (min-width: 768px) {
  .clothes-container {
    justify-content: space-around;
  }

  .clothes-container .primary-image,
  .clothes-container .secondary-image {
    max-width: 45%;
  }
}

@media (max-width: 767px) {
  .clothes-container {
    flex-direction: column;
    align-items: center;
  }

  .clothes-container .primary-image,
  .clothes-container .secondary-image,
  .additional-secondary-images img {
    max-width: 90%;
  }
}
</style>