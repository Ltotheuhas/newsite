<template>
    <v-container>
        <h1>Your Shopping Cart</h1>
        <v-row v-if="cartItems.length > 0">
            <v-col v-for="item in cartItems" :key="item.id" cols="12" md="8" offset-md="2">
                <v-card class="mb-4">
                    <v-row no-gutters>
                        <v-col cols="4">
                            <v-img :src="item.image" height="100" cover></v-img>
                        </v-col>
                        <v-col cols="8" class="d-flex flex-column">
                            <v-card-title>{{ item.name }}</v-card-title>
                            <v-card-subtitle>
                                {{ formatCurrency(item.price) }}
                                <span v-if="item.size"> - Size: {{ item.size }}</span>
                            </v-card-subtitle>
                            <v-card-actions>
                                <v-btn icon @click="decreaseQuantity(item)">-</v-btn>
                                <span>{{ item.quantity }}</span>
                                <v-btn icon @click="increaseQuantity(item)">+</v-btn>
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
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cartStore';

export default {
    name: 'ShoppingCart',
    setup() {
        const router = useRouter();
        const cartStore = useCartStore();

        const cartItems = computed(() => cartStore.items);
        const cartTotal = computed(() => cartStore.cartTotal);

        const formatCurrency = (value) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'EUR'
            }).format(value);
        };

        const increaseQuantity = (item) => {
            cartStore.updateQuantity(item.id, item.size, 1);
        };

        const decreaseQuantity = (item) => {
            cartStore.updateQuantity(item.id, item.size, -1);
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
            increaseQuantity,
            decreaseQuantity,
            removeItem,
            proceedToCheckout,
        };
    },
};
</script>

<style scoped>
.text-right {
    text-align: right;
}
</style>