<template>
    <v-container>
        <h1>Store</h1>
        <v-row>
            <v-col cols="12" md="4" v-for="product in products" :key="product._id">
                <v-card class="product-card" @click="openProductModal(product)"
                    @mouseenter="hoveredProduct = product._id" @mouseleave="hoveredProduct = null">
                    <v-img
                        :src="getImageUrl(hoveredProduct === product._id && product.images[1] ? product.images[1].asset._ref : product.images[0].asset._ref)"
                        aspect-ratio="1"></v-img>
                    <v-card-title>{{ product.name }}</v-card-title>
                    <v-card-subtitle>${{ product.price }}</v-card-subtitle>
                </v-card>
            </v-col>
        </v-row>

        <!-- Product Modal -->
        <v-dialog v-model="isModalOpen" max-width="600">
            <v-card v-if="selectedProduct">
                <v-card-title>{{ selectedProduct.name }}</v-card-title>
                <v-card-text>
                    <v-carousel hide-delimiters>
                        <v-carousel-item v-for="(image, index) in selectedProduct.images" :key="index"
                            :src="getImageUrl(image.asset._ref)"></v-carousel-item>
                    </v-carousel>
                    <p>{{ selectedProduct.description }}</p>

                    <!-- Size Dropdown if Available -->
                    <v-select v-if="selectedProduct.sizesWithStock && selectedProduct.sizesWithStock.length > 0"
                        v-model="selectedSize" :items="selectedProduct.sizesWithStock.map(sizeStock => sizeStock.size)"
                        label="Select Size"></v-select>

                    <!-- Quantity Selector -->
                    <v-row justify="space-between">
                        <v-btn icon @click="decrementQuantity">
                            <v-icon>mdi-minus</v-icon>
                        </v-btn>
                        <v-text-field v-model="quantity" type="number" min="1" :max="selectedSizeStock"
                            class="quantity-input" label="Quantity" readonly></v-text-field>
                        <v-btn icon @click="incrementQuantity">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-row>

                    <!-- Add to Cart Button -->
                    <v-btn class="snipcart-add-item" color="primary" :data-item-id="selectedProduct._id"
                        :data-item-name="selectedProduct.name" :data-item-price="selectedProduct.price"
                        :data-item-url="`https://luhas.gratis/api/products/${selectedProduct.slug}.json`"
                        :data-item-description="selectedProduct.description" :data-item-quantity="quantity"
                        :data-item-custom1-name="selectedProduct.sizesWithStock && selectedProduct.sizesWithStock.length > 0 ? 'Size' : undefined"
                        :data-item-custom1-value="selectedSize" @click="addToCart">
                        Add to Cart
                    </v-btn>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue';
import { getProducts } from '../sanity';

export default defineComponent({
    name: 'StoreView',
    setup() {
        const products = ref([]);
        const hoveredProduct = ref(null);
        const isModalOpen = ref(false);
        const selectedProduct = ref(null);
        const selectedSize = ref(null);
        const quantity = ref(1);

        onMounted(async () => {
            try {
                products.value = await getProducts();
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        });

        const getImageUrl = (ref) => {
            return `https://cdn.sanity.io/images/1s0at5ry/production/${ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png')}`;
        };

        const openProductModal = (product) => {
            selectedProduct.value = product;
            selectedSize.value = product.sizesWithStock && product.sizesWithStock[0]?.size;
            quantity.value = 1;
            isModalOpen.value = true;
        };

        const incrementQuantity = () => {
            if (!selectedSizeStock.value || quantity.value < selectedSizeStock.value) {
                quantity.value += 1;
            }
        };

        const decrementQuantity = () => {
            if (quantity.value > 1) {
                quantity.value -= 1;
            }
        };

        const selectedSizeStock = computed(() => {
            if (!selectedProduct.value || !selectedSize.value) return null;
            const sizeStock = selectedProduct.value.sizesWithStock.find(
                (stock) => stock.size === selectedSize.value
            );
            return sizeStock ? sizeStock.stock : null;
        });

        const addToCart = () => {
            isModalOpen.value = false; // Close the modal when item is added to the cart
        };

        return {
            products,
            hoveredProduct,
            isModalOpen,
            selectedProduct,
            selectedSize,
            quantity,
            openProductModal,
            incrementQuantity,
            decrementQuantity,
            selectedSizeStock,
            addToCart,
            getImageUrl,
        };
    },
});
</script>

<style scoped>
.product-card {
    cursor: pointer;
    transition: transform 0.2s;
}

.product-card:hover {
    transform: scale(1.05);
}

.quantity-input {
    width: 80px;
}
</style>