<template>
  <div v-if="product">
    <h1>{{ product.name }}</h1>
    <p>{{ product.description }}</p>
    <img :src="product.image" alt="Product image" />
    <p>Price: €{{ product.price }}</p>
    <button
      class="snipcart-add-item"
      :data-item-id="product.id"
      :data-item-name="product.name"
      :data-item-price="product.price"
      :data-item-url="product.url"
      :data-item-max-quantity="product.maxQuantity"
    >
      Buy Now
    </button>
  </div>
  <div v-else>
    <p>Loading product details...</p>
  </div>
</template>

<script>
export default {
  props: ['id'],
  data() {
    return {
      product: null
    };
  },
  async created() {
    try {
      const response = await fetch('/products.json');
      if (!response.ok) {
        throw new Error('Failed to fetch product data');
      }
      const products = await response.json();
      this.product = products.find(item => item.id === this.id);
    } catch (error) {
      console.error(error);
    }
  }
};
</script>
