<template>
  <v-container>
    <v-img :src="require(`../assets/arigato.png`)" style="max-width: 600px;"></v-img>
    <p>Your order was successful</p>

    <div class="mt-8" v-if="orderDetails">
      <h3>Order Details</h3>
      <v-list style="background: none;">
        <v-list-item v-for="item in orderDetails.items" :key="item.id">
          <v-list-item-content>
            <v-list-item-title>
              {{ item.name }} <span v-if="item.size">- {{ item.size }}</span>
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ formatCurrency(item.price) }} <span v-if="item.quantity > 1">x {{ item.quantity }}</span>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <h4>Total: {{ formatCurrency(orderDetails.total) }}</h4>

      <v-btn color="primary" large class="store-btn mt-4" @click="$router.push('/store')"
        :style="{ filter: `hue-rotate(${orderDetails.total}deg)` }">Back 2 Store</v-btn>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'OrderConfirmationView',
  data() {
    return {
      orderDetails: null,
    };
  },
  mounted() {
    const savedOrderDetails = sessionStorage.getItem('orderDetails');
    if (savedOrderDetails) {
      this.orderDetails = JSON.parse(savedOrderDetails);

      sessionStorage.removeItem('orderDetails');
    }
  },
  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR',
      }).format(value);
    },
  },
};
</script>

<style scoped>
.store-btn {
  text-transform: none;
  border-radius: 4px;
  height: 50px;
}

::v-deep(.store-btn .v-btn__content) {
  font-family: 'Cabazon', sans-serif;
  font-size: 1.6em;
}
</style>