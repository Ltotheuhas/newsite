<template>
    <v-container>
        <v-row>
            <v-col v-for="product in products" :key="product._id" cols="12" sm="6" md="4">
                <v-card>
                    <v-img :src="product.images[0]" height="200px" />
                    <v-card-title>{{ product.name }}</v-card-title>
                    <v-card-subtitle>{{ formatCurrency(product.price) }}</v-card-subtitle>
                    <v-card-text>{{ product.description }}</v-card-text>
                    <v-btn @click="addToCart(product)">Add to Cart</v-btn>
                </v-card>
            </v-col>
        </v-row>
        <v-btn class="mt-5" :disabled="cart.length === 0" @click="checkout">
            Checkout
        </v-btn>
    </v-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import { loadStripe } from '@stripe/stripe-js';
import { getProducts } from '../sanity.js';

// Load Stripe with your public key
const stripePromise = loadStripe('pk_test_51QHPQZBmSyJV72ZkDjAOJy4FTCntA2ZvRidQ0fwAuoGtCQMfl5inUxs0NpqocyG4CUE1AHOj5LnlxlbDemQG3VXK00Fs7s5ir0');

export default {
    name: 'StoreView',
    setup() {
        const products = ref([]);
        const cart = ref([]);

        // Fetch products from Sanity when component mounts
        onMounted(async () => {
            products.value = await getProducts();
        });

        // Add a product to the cart
        const addToCart = (product) => {
            const existingProduct = cart.value.find(item => item.id === product._id);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.value.push({
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                });
            }
        };

        // Format price as currency
        const formatCurrency = (value) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(value);
        };

        // Checkout with Stripe
        const checkout = async () => {
            const stripe = await stripePromise;
            const response = await fetch('/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: cart.value }),
            });

            const session = await response.json();
            await stripe.redirectToCheckout({ sessionId: session.id });
        };

        return { products, cart, addToCart, checkout, formatCurrency };
    },
};
</script>

<style scoped>
/* Add any custom styling here if needed */
</style>
