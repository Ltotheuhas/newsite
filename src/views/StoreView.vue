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

        // Define custom styles
        const cardStyle = {
          base: {
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
              color: '#a0aec0', // Lighter placeholder color
            },
          },
          invalid: {
            color: '#fa755a',
            iconColor: '#fa755a',
          },
        };

        cardElement.value = elements.value.create('card', { style: cardStyle });

        setTimeout(() => {
          const cardElementContainer = document.getElementById('card-element');
          if (cardElementContainer) {
            cardElement.value.mount('#card-element');
            console.log('cardElement mounted with custom styling');
          } else {
            console.error('#card-element not found in DOM');
          }
        }, 200); // Adjust delay if needed
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
      try {
        const response = await fetch('/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: cart.value }),
        });
        const data = await response.json();
        clientSecret.value = data.clientSecret; // Trigger watch on clientSecret

        console.log('clientSecret:', clientSecret.value); // Check clientSecret value
      } catch (error) {
        console.error('Error fetching clientSecret:', error);
      }
    };

    const handlePayment = async () => {
      console.log('Attempting to confirm payment');
      console.log('Client Secret:', clientSecret.value);
      console.log('Card Element:', cardElement.value);

      if (!clientSecret.value) {
        console.error('clientSecret is not available');
        return;
      }

      if (!cardElement.value) {
        console.error('cardElement is not available');
        return;
      }

      const { error, paymentIntent } = await stripe.value.confirmCardPayment(clientSecret.value, {
        payment_method: {
          card: cardElement.value,
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

    return { products, cart, addToCart, checkout, formatCurrency, handlePayment, clientSecret };
  },
};
</script>

<style scoped>
#card-element {
  padding: 10px;
  border: 1px solid #ccd0d5;
  border-radius: 4px;
  background-color: #f9f9f9;
}
</style>
