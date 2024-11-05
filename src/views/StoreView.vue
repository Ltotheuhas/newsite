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
    <form v-if="clientSecret" @submit.prevent="handlePayment">
      <StripeElements :stripe="stripe">
        <StripeElement ref="card" type="card" /> <!-- StripeElement component for card input -->
      </StripeElements>
      <v-btn type="submit">Submit Payment</v-btn>
    </form>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import { StripeElement, StripeElements, initStripe } from 'vue-stripe-js';
import { getProducts } from '../sanity.js';

export default {
  name: 'StoreView',
  components: { StripeElements, StripeElement },
  setup() {
    const products = ref([]);
    const cart = ref([]);
    const clientSecret = ref(null);

    // Initialize Stripe
    const stripe = initStripe('pk_test_51QHPQZBmSyJV72ZkDjAOJy4FTCntA2ZvRidQ0fwAuoGtCQMfl5inUxs0NpqocyG4CUE1AHOj5LnlxlbDemQG3VXK00Fs7s5ir0');

    onMounted(async () => {
      products.value = await getProducts();
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
      try {
        const response = await fetch('/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: cart.value }),
        });
        const data = await response.json();
        clientSecret.value = data.clientSecret;
        console.log('clientSecret:', clientSecret.value);
      } catch (error) {
        console.error('Error fetching clientSecret:', error);
      }
    };

    const handlePayment = async () => {
      console.log('Attempting to confirm payment');

      if (!clientSecret.value) {
        console.error('clientSecret is not available');
        return;
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret.value, {
        payment_method: {
          card: stripe.elements.getElement('card'), // Retrieve the Card element from vue-stripe-js
        },
      });

      if (error) {
        console.error('Payment failed:', error.message);
        alert('Payment failed: ' + error.message);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment successful');
        alert('Payment successful!');
      }
    };

    return { products, cart, addToCart, checkout, formatCurrency, handlePayment, clientSecret, stripe };
  },
};
</script>

<style scoped>
/* Add any custom styling here if needed */
</style>
