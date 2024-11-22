<template>
  <v-container>
    <v-row>
      <v-col v-for="product in products" :key="product._id" cols="12" sm="6" md="4">
        <v-card :ripple="false" class="product-card" @click="openProductModal(product)" @mouseenter="applyGlitchEffect"
          @mouseleave="resetFilter" ref="productCards">
          <v-img :src="mainImage(product)" height="250px" class="product-image" />
          <v-card-title class="product-title">{{ product.name }}</v-card-title>
          <v-card-subtitle class="product-price pb-2">{{ formatCurrency(product.price) }}</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <ProductModal :product="selectedProduct" :isOpen="isModalOpen" @update:isOpen="isModalOpen = $event"
      @add-to-cart="addToCart" />
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getProducts, urlFor } from '../sanity.js';
import ProductModal from '../components/ProductModal.vue';
import { useCartStore } from '../stores/cartStore';

export default {
  name: 'StoreView',
  components: { ProductModal },
  setup() {
    const products = ref([]);
    const selectedProduct = ref(null);
    const isModalOpen = ref(false);
    const cartStore = useCartStore();
    const glitchIntervals = new Map();

    onMounted(async () => {
      products.value = await getProducts();
    });

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR',
      }).format(value);
    };

    const openProductModal = (product) => {
      selectedProduct.value = product;
      isModalOpen.value = true;
    };

    const addToCart = (product, quantity, size, sizeKey) => {
      cartStore.addToCart(product, size, quantity, sizeKey);
      isModalOpen.value = false;
    };

    const mainImage = (product) => {
      return product.images[0] ? urlFor(product.images[0]).width(400).url() : null;
    };

    const applyGlitchEffect = (event) => {
      const element = event.currentTarget;

      if (glitchIntervals.has(element)) return;

      const glitchInterval = setInterval(() => {
        const randomBlur = Math.random() * 8;
        const randomHue = Math.random() * 360;
        element.style.filter = `blur(${randomBlur}px) hue-rotate(${randomHue}deg) drop-shadow(0px 0px 15px #000000)`;
      }, 100);

      glitchIntervals.set(element, glitchInterval);
      setTimeout(() => {
        clearInterval(glitchInterval);
        glitchIntervals.delete(element);
        element.style.filter = '';
      }, 500);
    };

    const resetFilter = (event) => {
      const element = event.currentTarget;
      if (glitchIntervals.has(element)) {
        clearInterval(glitchIntervals.get(element));
        glitchIntervals.delete(element);
        element.style.filter = '';
      }
    };

    return {
      products,
      formatCurrency,
      openProductModal,
      addToCart,
      selectedProduct,
      isModalOpen,
      mainImage,
      applyGlitchEffect,
      resetFilter,
    };
  },
};
</script>

<style scoped>
.product-card {
  filter: blur(1px) hue-rotate(44deg) drop-shadow(0px 0px 15px #000000);
  transition: filter 0.5s;
}

.product-card:hover {
  filter: none;
}

.product-image {
  mix-blend-mode: exclusion;
}
</style>
