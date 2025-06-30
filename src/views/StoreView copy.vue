<template>
  <template v-if="isMobile && selectedProduct">
    <ProductDetails :product="selectedProduct" @add-to-cart="addToCart" @go-back="closeModal" />
  </template>

  <template v-else>
    <v-container>
      <v-row>
        <v-col v-for="product in products" :key="product._id" cols="12" sm="6" md="4">
          <v-card class="product-card" @click="openProduct(product)" @mouseenter="applyGlitchEffect"
            @mouseleave="resetFilter">
            <v-img :src="mainImage(product)" height="250px" class="product-image" />
            <v-card-title class="product-title">{{ product.name }}</v-card-title>
            <v-card-subtitle class="product-price pb-2">
              {{ formatCurrency(product.price) }}
            </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <ProductModal v-if="!isMobile && selectedProduct" :product="selectedProduct" :isOpen="isModalOpen"
      @update:isOpen="handleModalUpdate" @add-to-cart="addToCart" />
  </template>
</template>

<script>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getProducts, urlFor } from '../sanity.js';
import ProductModal from '../components/ProductModal.vue';
import ProductDetails from '../components/ProductDetails.vue';
import { useCartStore } from '../stores/cartStore';
import { useWindowSize } from '@vueuse/core';

export default {
  name: 'StoreView',
  components: {
    ProductModal,
    ProductDetails,
  },
  props: {
    productId: String, // from the route if provided
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const products = ref([]);
    const selectedProduct = ref(null);
    const isModalOpen = ref(false);
    const cartStore = useCartStore();
    const glitchIntervals = new Map();
    const { width } = useWindowSize();

    // Define a breakpoint for mobile, for example 960px:
    const isMobile = computed(() => width.value < 960);

    const fetchProducts = async () => {
      if (!products.value.length) {
        products.value = await getProducts();
      }
      // If a productId exists in the URL, open that product.
      if (props.productId) {
        const productToOpen = products.value.find(
          (product) => product._id === props.productId
        );
        if (productToOpen) {
          openProduct(productToOpen);
        }
      }
    };

    onMounted(fetchProducts);

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR',
      }).format(value);
    };

    const openProduct = (product) => {
      selectedProduct.value = product;
      isModalOpen.value = true;

      // Update the URL. (The route already exists in your config.)
      router.push({ name: 'ProductModal', params: { productId: product._id } });
    };

    const closeModal = () => {
      isModalOpen.value = false;
      selectedProduct.value = null;
      router.replace({ path: '/store', query: {} });
    };

    // Watch for route changes (e.g. if user manually navigates away)
    watch(
      () => route.params.productId,
      (newProductId) => {
        if (newProductId) {
          const productToOpen = products.value.find(
            (product) => product._id === newProductId
          );
          if (productToOpen) {
            openProduct(productToOpen);
          }
        } else {
          closeModal();
        }
      }
    );

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

    const handleModalUpdate = (newVal) => {
      isModalOpen.value = newVal;
      if (!newVal) closeModal();
    };

    return {
      products,
      formatCurrency,
      openProduct,
      closeModal,
      addToCart,
      selectedProduct,
      isModalOpen,
      mainImage,
      applyGlitchEffect,
      resetFilter,
      isMobile,
      handleModalUpdate
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
