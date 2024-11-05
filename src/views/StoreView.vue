<template>
  <v-container>
    <v-row>
      <v-col v-for="product in products" :key="product._id" cols="12" sm="6" md="4">
        <v-card>
          <v-img :src="product.images[0]" height="200px" />
          <v-card-title>{{ product.name }}</v-card-title>
          <v-card-subtitle>{{ formatCurrency(product.price) }}</v-card-subtitle>
          <v-card-text>{{ product.description }}</v-card-text>

          <!-- Size selection if product has sizesWithStock -->
          <v-select v-if="product.sizesWithStock?.length > 0" v-model="selectedSizes[product._id]"
            :items="product.sizesWithStock.map(size => size.size)" label="Select Size"
            @change="checkStockAvailability(product)"></v-select>

          <!-- Add to Cart Button -->
          <v-btn @click="addToCart(product, selectedSizes[product._id])" :disabled="!isInStock(product)">
            Add to Cart
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
    <v-btn class="mt-5" :disabled="cartItems.length === 0" @click="goToCart">
      View Cart
    </v-btn>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getProducts } from '../sanity.js';
import { useCartStore } from '../stores/cartStore';

export default {
  name: 'StoreView',
  setup() {
    const products = ref([]);
    const cartStore = useCartStore();
    const cartItems = cartStore.items;
    const router = useRouter();
    const selectedSizes = ref({});

    onMounted(async () => {
      products.value = await getProducts();
    });

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value);
    };

    const addToCart = (product, size) => {
      cartStore.addToCart(product, size);
    };

    const checkStockAvailability = (product) => {
      const selectedSize = selectedSizes.value[product._id];
      const sizeStock = product.sizesWithStock?.find(size => size.size === selectedSize);
      return sizeStock ? sizeStock.stock > 0 : product.quantity > 0;
    };

    const isInStock = (product) => {
      if (product.sizesWithStock?.length > 0) {
        return checkStockAvailability(product);
      }
      return product.quantity > 0;
    };

    const goToCart = () => {
      router.push({ name: 'ShoppingCart' });
    };

    return { products, cartItems, addToCart, formatCurrency, goToCart, selectedSizes, isInStock };
  },
};
</script>

<style scoped>
/* Styling as needed */
</style>