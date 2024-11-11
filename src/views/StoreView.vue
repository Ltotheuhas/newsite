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

    <v-dialog v-model="isModalOpen" max-width="600px">
      <v-card>
        <v-carousel v-if="selectedProduct">
          <v-carousel-item v-for="(image, index) in selectedProduct.images" :key="index">
            <v-img :src="urlFor(image).width(600).url()" height="400px" />
          </v-carousel-item>
        </v-carousel>
        <v-card-title>{{ selectedProduct?.name }}</v-card-title>
        <v-card-subtitle>{{ formatCurrency(selectedProduct?.price) }}</v-card-subtitle>
        <v-card-text>{{ selectedProduct?.description }}</v-card-text>
        <v-row>
          <v-col cols="6" v-if="selectedProduct?.sizesWithStock?.length > 0">
            <v-select v-model="selectedSize"
              :items="selectedProduct.sizesWithStock.filter(size => size.stock > 0).map(size => size.size)"
              label="Select Size" dense @change="updateMaxQuantity"></v-select>
          </v-col>
          <QuantitySelector :value="selectedQuantity" :maxQuantity="maxQuantity"
            :cols="selectedProduct?.sizesWithStock?.length > 0 ? 6 : 12" @update:value="selectedQuantity = $event" />
        </v-row>
        <v-card-actions>
          <v-btn color="primary" @click="addToCart(selectedProduct, selectedQuantity, selectedSize)">Add to Cart</v-btn>
          <v-btn text @click="closeProductModal">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue';
import { getProducts, urlFor } from '../sanity.js';
import { useCartStore } from '../stores/cartStore';
import QuantitySelector from '../components/QuantitySelector.vue';

export default {
  name: 'StoreView',
  components: {
    QuantitySelector,
  },
  setup() {
    const products = ref([]);
    const cartStore = useCartStore();
    const selectedProduct = ref(null);
    const selectedQuantity = ref(1);
    const selectedSize = ref(null);
    const isModalOpen = ref(false);

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
      selectedQuantity.value = 1;
      selectedSize.value = product.sizesWithStock?.length > 0 ? product.sizesWithStock[0].size : null;
      isModalOpen.value = true;
      updateMaxQuantity();
    };

    const closeProductModal = () => {
      isModalOpen.value = false;
      selectedProduct.value = null;
      selectedSize.value = null;
    };

    const addToCart = (product, quantity, size) => {
      let sizeKey = null;

      if (product.sizesWithStock?.length > 0 && size) {
        const sizeEntry = product.sizesWithStock.find(sizeStock => sizeStock.size === size);
        sizeKey = sizeEntry ? sizeEntry._key : null;
      }

      cartStore.addToCart(product, size, quantity, sizeKey); // Pass sizeKey to the cart store
      closeProductModal();
    };

    const maxQuantity = computed(() => {
      if (!selectedProduct.value) return 1;

      if (selectedProduct.value.sizesWithStock?.length > 0 && selectedSize.value) {
        const sizeStock = selectedProduct.value.sizesWithStock.find(size => size.size === selectedSize.value);
        if (sizeStock) {
          const cartItem = cartStore.items.find(item => item.id === selectedProduct.value._id && item.size === selectedSize.value);
          const availableStock = cartItem ? sizeStock.stock - cartItem.quantity : sizeStock.stock;
          return availableStock > 0 ? availableStock : 1;
        }
      } else if (selectedProduct.value.quantity) {
        const cartItem = cartStore.items.find(item => item.id === selectedProduct.value._id);
        const availableStock = cartItem ? selectedProduct.value.quantity - cartItem.quantity : selectedProduct.value.quantity;
        return availableStock > 0 ? availableStock : 1;
      }
      return 1;
    });

    const increaseQuantity = () => {
      if (selectedQuantity.value < maxQuantity.value) {
        selectedQuantity.value += 1;
      }
    };

    const decreaseQuantity = () => {
      if (selectedQuantity.value > 1) {
        selectedQuantity.value -= 1;
      }
    };

    const updateMaxQuantity = () => {
      if (selectedQuantity.value > maxQuantity.value) {
        selectedQuantity.value = maxQuantity.value;
      }
    };

    const mainImage = (product) => {
      return product.images[0] ? urlFor(product.images[0]).width(400).url() : null;
    };

    watch(selectedSize, (newSize) => {
      if (selectedProduct.value && selectedProduct.value.sizesWithStock) {
        const newSizeStock = selectedProduct.value.sizesWithStock.find(size => size.size === newSize);
        if (newSizeStock && selectedQuantity.value > newSizeStock.stock) {
          selectedQuantity.value = newSizeStock.stock;
        }
      }
    });

    return {
      products,
      formatCurrency,
      openProductModal,
      closeProductModal,
      addToCart,
      selectedProduct,
      selectedQuantity,
      selectedSize,
      isModalOpen,
      urlFor,
      maxQuantity,
      increaseQuantity,
      decreaseQuantity,
      updateMaxQuantity,
      mainImage,
    };
  }
};
</script>

<style scoped>
.product-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.product-card:hover {
  transform: scale(1.05);
}

.product-image {
  transition: opacity 0.3s ease;
}

.product-title {
  text-align: center;
  font-weight: bold;
}

.product-price {
  text-align: center;
  color: gray;
}
</style>