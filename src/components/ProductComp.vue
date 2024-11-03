<template>
    <v-container>
        <h2>{{ product.name }}</h2>
        <p>{{ product.description }}</p>
        <p>Price: ${{ product.price }}</p>
        <button class="snipcart-add-item" :data-item-id="product._id" :data-item-name="product.name"
            :data-item-price="product.price" :data-item-url="product.url" :data-item-description="product.description">
            Add to Cart
        </button>
    </v-container>
</template>

<script>
import { client } from '@/sanity.js';

export default {
    name: 'ProductComp',
    props: ['slug'],
    data() {
        return {
            product: null
        };
    },
    async created() {
        this.product = await client.fetch(`*[_type == "product" && slug.current == $slug][0]`, { slug: this.slug });

        // Add the dynamic URL property for Snipcart
        this.product.url = `https://luhas.gratis/store/${this.product.slug.current}`;
    }
};
</script>
