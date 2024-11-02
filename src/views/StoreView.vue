<template>
    <div>
      <h1>Our Store</h1>
      <div v-for="product in products" :key="product.id">
        <h2>{{ product.name }}</h2>
        <router-link :to="`/store/${product.id}`">View Product</router-link>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        products: []
      };
    },
    async created() {
      try {
        // Use the correct path based on the environment
        const baseURL = process.env.NODE_ENV === 'production' ? '/newsite' : '';
        const response = await fetch(`${baseURL}/products.json`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        this.products = await response.json();
      } catch (error) {
        console.error(error);
      }
    }
  };
  </script>
  