<template>
  <v-container>
    <v-img :src="require(`../assets/arigato.png`)" style="max-width: 600px;"></v-img>
    <p>Your order was successful</p>

    <div v-if="orderDetails">
      <h2>Order Summary</h2>
      <v-list>
        <v-list-item v-for="(item, index) in orderDetails.items" :key="index">
          <v-list-item-content>
            <v-list-item-title>{{ item.name }} <span v-if="item.size">- {{ item.size }}</span></v-list-item-title>
            <v-list-item-subtitle>
              {{ formatCurrency(item.price) }}
              <span v-if="item.quantity > 1"> x {{ item.quantity }}</span>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <h3>Total: {{ formatCurrency(orderDetails.total) }}</h3>
    </div>

    <v-btn color="primary" @click="$router.push('/store')">Back to Store</v-btn>
  </v-container>
</template>

<script>
import { computed } from 'vue';
import { useCartStore } from '../stores/cartStore';

export default {
  name: 'ConfirmationView',
  setup() {
    const cartStore = useCartStore();
    const orderDetails = computed(() => cartStore.orderDetails);

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR'
      }).format(value);
    };

    return {
      orderDetails,
      formatCurrency
    };
  }
};
</script>