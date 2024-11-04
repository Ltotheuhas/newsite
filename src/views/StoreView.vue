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
  
      <!-- Payment form appears only if clientSecret is set -->
      <form @submit.prevent="handlePayment" v-if="clientSecret">
        <div id="card-element"><!-- Stripe Card Element will mount here --></div>
        <v-btn type="submit">Submit Payment</v-btn>
      </form>
    </v-container>
  </template>
  
  <script>
  import { ref, onMounted, watch } from 'vue';
  import { loadStripe } from '@stripe/stripe-js';
  import { getProducts } from '../sanity.js';
  
  const stripePromise = loadStripe('pk_test_51QHPQZBmSyJV72ZkDjAOJy4FTCntA2ZvRidQ0fwAuoGtCQMfl5inUxs0NpqocyG4CUE1AHOj5LnlxlbDemQG3VXK00Fs7s5ir0');
  
  export default {
    name: 'StoreView',
    setup() {
      const products = ref([]);
      const cart = ref([]);
      const stripe = ref(null);
      const elements = ref(null);
      const cardElement = ref(null);
      const clientSecret = ref(null);
  
      onMounted(async () => {
        products.value = await getProducts();
        stripe.value = await stripePromise;
      });
  
      // Watch for clientSecret and initialize cardElement only when it's set
      watch(clientSecret, async (newSecret) => {
        if (newSecret) {
          elements.value = stripe.value.elements();
          cardElement.value = elements.value.create('card');
          cardElement.value.mount('#card-element');
        }
      });
  
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
  
      const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(value);
      };
  
      const checkout = async () => {
        const response = await fetch('/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: cart.value }),
        });
        const data = await response.json();
        clientSecret.value = data.clientSecret; // Trigger watch on clientSecret
      };
  
      const handlePayment = async () => {
        const { error } = await stripe.value.confirmCardPayment(clientSecret.value, {
          payment_method: {
            card: cardElement.value,
          },
        });
  
        if (error) {
          console.error('Payment failed:', error.message);
        } else {
          console.log('Payment successful');
          // Redirect or show confirmation message
        }
      };
  
      return { products, cart, addToCart, checkout, formatCurrency, handlePayment, clientSecret };
    },
  };
  </script>
  
  <style scoped>
  /* Add any custom styling here if needed */
  </style>
  