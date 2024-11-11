<template>
    <v-container>
        <h1>Your Shopping Cart</h1>
        <v-row v-if="cartItems.length > 0">
            <v-col v-for="item in cartItems" :key="item.id" cols="12" md="8" offset-md="2">
                <v-card class="mb-4">
                    <v-row no-gutters>
                        <v-col cols="4">
                            <v-img :src="getImageUrl(item.image)" height="100" cover></v-img>
                        </v-col>
                        <v-col cols="8" class="d-flex flex-column">
                            <v-card-title>{{ item.name }}</v-card-title>
                            <v-card-subtitle>
                                {{ formatCurrency(item.price) }}
                                <span v-if="item.size"> - Size: {{ item.size }}</span>
                            </v-card-subtitle>
                            <v-card-actions>
                                <QuantitySelector :value="item.quantity" :maxQuantity="getMaxQuantity(item)" cols="4"
                                    @update:value="updateItemQuantity(item, $event)" />
                                <v-spacer></v-spacer>
                                <v-btn icon @click="removeItem(item.id, item.size)">
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </v-card-actions>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
        <p v-else>Your cart is empty.</p>
        <v-divider v-if="cartItems.length > 0"></v-divider>
        <div class="text-right mt-4" v-if="cartItems.length > 0">
            <h2>Total: {{ formatCurrency(cartTotal) }}</h2>
            <v-btn color="primary" @click="proceedToCheckout">Proceed to Checkout</v-btn>
        </div>
    </v-container>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cartStore';
import { getProductById, urlFor } from '../sanity.js';
import QuantitySelector from '../components/QuantitySelector.vue';

export default {
    name: 'ShoppingCart',
    components: {
        QuantitySelector,
    },
    setup() {
        const router = useRouter();
        const cartStore = useCartStore();
        const cartItems = computed(() => cartStore.items);
        const cartTotal = computed(() => cartStore.cartTotal);

        const maxQuantities = ref({});

        // Pre-fetch max quantities for all items in the cart
        onMounted(async () => {
            const maxQuantitiesObj = {};
            for (const item of cartItems.value) {
                const product = await getProductById(item.id);
                if (item.size) {
                    const sizeStock = product.sizesWithStock.find(size => size.size === item.size);
                    maxQuantitiesObj[item.id] = sizeStock ? sizeStock.stock : 1;
                } else {
                    maxQuantitiesObj[item.id] = product.quantity || 1;
                }
            }
            maxQuantities.value = maxQuantitiesObj;
        });

        const getMaxQuantity = (item) => maxQuantities.value[item.id] || 1;

        const formatCurrency = (value) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'EUR'
            }).format(value);
        };

        const getImageUrl = (imageRef) => {
            return imageRef ? urlFor(imageRef).width(100).url() : '';
        };

        const updateItemQuantity = (item, newQuantity) => {
            const maxQuantity = getMaxQuantity(item);
            const quantityChange = Math.min(newQuantity, maxQuantity) - item.quantity;
            cartStore.updateQuantity(item.id, item.size, quantityChange);
        };

        const removeItem = (productId, size) => {
            cartStore.removeFromCart(productId, size);
        };

        const proceedToCheckout = () => {
            router.push({ name: 'checkout' });
        };

        return {
            cartItems,
            cartTotal,
            formatCurrency,
            removeItem,
            proceedToCheckout,
            getImageUrl,
            updateItemQuantity,
            getMaxQuantity,
        };
    },
};
</script>

<style scoped>
.text-right {
    text-align: right;
}
</style>
