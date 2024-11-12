<template>
  <v-container>
    <v-row>
      <v-col v-for="product in products" :key="product._id" cols="12" sm="6" md="4">
        <v-card class="product-card" @click="openProductModal(product)">
          <v-img :src="mainImage(product)" height="250px" class="product-image" />
          <v-card-title class="product-title">{{ product.name }}</v-card-title>
          <v-card-subtitle class="product-price">{{ formatCurrency(product.price) }}</v-card-subtitle>
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
import { useCartStore } from '../stores/cartStore'; // Import cartStore

export default {
  name: 'StoreView',
  components: { ProductModal },
  setup() {
    const products = ref([]);
    const selectedProduct = ref(null);
    const isModalOpen = ref(false);
    const cartStore = useCartStore(); // Initialize cartStore

    onMounted(async () => {
      products.value = await getProducts();
    });

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR'
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

    return {
      products,
      formatCurrency,
      openProductModal,
      addToCart,
      selectedProduct,
      isModalOpen,
      mainImage,
    };
  },
};
</script>