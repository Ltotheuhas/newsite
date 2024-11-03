<template>
    <v-container>
      <h2>{{ product.name }}</h2>
      <p>{{ product.description }}</p>
      <p>Price: ${{ product.price }}</p>
      <button
        class="snipcart-add-item"
        :data-item-id="product.id"
        :data-item-name="product.name"
        :data-item-price="product.price"
        :data-item-url="product.url"
        :data-item-description="product.description"
      >
        Add to Cart
      </button>
    </v-container>
  </template>
  
  <script>
  export default {
    name: 'ProductComp',
    data() {
      return {
        product: {
          id: 'test-product',
          name: 'Test Product',
          price: '0.00',
          url: `https://luhas.gratis/store/test-product`,
          description: 'This is a test product description.'
        }
      };
    }
  };
  </script>
  