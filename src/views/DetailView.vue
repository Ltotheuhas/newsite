<template>
  <div v-if="currentItem" class="detail-view">
    <div class="year-display" v-if="currentItem.year" @click="$emit('toggle-drawer')">{{ currentItem.year }}</div>
    <div v-if="currentItem.name === 'evaGif'">
      <EvaView></EvaView>
    </div>
    <div v-else-if="currentItem.name === 'notebook'">
      <NotebookView></NotebookView>
    </div>
    <div v-else-if="currentItem.name === 'netcronomicon'">
      <NetcroNomicon></NetcroNomicon>
    </div>
    <div v-else>
      <div v-if="currentItem.category && currentItem.category.includes('clothes')" class="clothes-container">
        <img :src="currentItem.primary" :alt="`${currentItem.name}`" class="primary-image" />
        <img v-if="currentItem.secondary && currentItem.secondary.length" :src="currentItem.secondary[0]"
          :alt="`${currentItem.name} secondary 0`" class="secondary-image" />
        <div class="additional-secondary-images" v-if="currentItem.secondary && currentItem.secondary.length > 1">
          <img v-for="(image, index) in currentItem.secondary.slice(1)" :key="index" :src="image"
            :alt="`${currentItem.name} secondary ${index + 1}`" />
        </div>
      </div>
      <div v-else>
        <img :src="currentItem.primary" :alt="`${currentItem.name}`" class="primary-image" />
        <div v-if="currentItem.secondary && currentItem.secondary.length" class="secondary-images">
          <img v-for="(image, index) in currentItem.secondary" :key="index" :src="image"
            :alt="`${currentItem.name} secondary ${index}`" />
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
      <div v-if="currentItem.embedUrls && currentItem.embedUrls.length" class="video-embed">
        <div class="video-container" v-for="(url, index) in currentItem.embedUrls" :key="index">
          <iframe :src="url" frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen></iframe>
        </div>
      </div>
      <div v-if="currentItem.bcembed && currentItem.bcembed.length" class="ma-auto">
        <iframe class="bcembed"
          :src="`https://bandcamp.com/EmbeddedPlayer/album=${currentItem.bcembed}/size=large/bgcol=333333/linkcol=ffffff/artwork=none/transparent=true/`"
          seamless allow="encrypted-media"></iframe>
      </div>
    </div>
  </div>
  <div class="detail-view" v-else>
    <FourOhFour></FourOhFour>
  </div>
  <p class="back" v-if="!fromList">
    <router-link class="back" :to="{ path: '/portfolio', query: { view: 'grid' } }">back</router-link>
  </p>
</template>

<script>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { portfolioItems } from '@/data/portfolioItems';
import EvaView from './EvaView.vue';
import NotebookView from './NotebookView.vue';
import NetcroNomicon from './NetcroNomicon.vue';
import FourOhFour from './FourOhFour.vue';

export default {
  components: {
    EvaView,
    NotebookView,
    NetcroNomicon,
    FourOhFour
  },

  props: {
    item: Object,
    fromList: {
      type: Boolean,
      default: false,
    }
  },

  methods: {
    toggleDrawer() {
      this.$emit('toggle-drawer');
    },
  },

  setup(props) {
    const route = useRoute();
    const currentItem = ref(props.item || null);

    const loadItemFromRoute = () => {
      if (!props.item) {
        const itemId = route.params.id;
        const foundItem = portfolioItems.find(i => i.name === itemId);
        if (foundItem) {
          currentItem.value = foundItem;
        }
      }
    };

    onMounted(loadItemFromRoute);
    watch(() => route.params.id, loadItemFromRoute);

    const normalizedDescription = computed(() => {
      const description = currentItem.value?.description;
      if (typeof description === 'string') {
        return [{ type: 'html', content: description }];
      } else if (Array.isArray(description)) {
        return description;
      }
      return [];
    });

    return { currentItem, normalizedDescription };
  },
};
</script>

<style scoped>
.detail-view {
  text-align: center;
  padding-top: 15px;
}

.primary-image,
.secondary-image,
.secondary-images img,
.additional-secondary-images img {
  max-width: 100%;
  max-height: 700px;
  margin-bottom: 20px;
  margin: 5px;
  object-fit: contain;
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
  mix-blend-mode: darken;
}

.bcembed {
  border: 0;
  width: 100%;
  max-width: 480px;
  height: 210px;
}

.clothes-container,
.additional-secondary-images {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.clothes-container .primary-image,
.clothes-container .secondary-image {
  max-width: 45%;
  margin: 5px;
}

@media (min-width: 768px) {
  .clothes-container {
    justify-content: space-around;
  }
}

@media (max-width: 767px) {
  .clothes-container {
    flex-direction: column;
    align-items: center;
  }

  .clothes-container .primary-image,
  .clothes-container .secondary-image {
    max-width: 90%;
  }
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

  .detail-view {
    padding-top: 30px;
  }

  .description {
    font-size: 16px;
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
</style>
