<template>
    <v-container>
        <h1>Store</h1>
        <v-row>
            <!-- Loop through each product -->
            <v-col cols="12" md="4" v-for="product in products" :key="product.id">
                <v-card>
                    <v-card-title>{{ product.name }}</v-card-title>
                    <v-card-subtitle>\${{ product.price }}</v-card-subtitle>
                    <v-card-actions>
                        <button class="snipcart-add-item" :data-item-id="product.id" :data-item-name="product.name"
                            :data-item-price="product.price" :data-item-url="product.url"
                            :data-item-description="product.description">
                            Add to Cart
                        </button>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'StoreView',
    data() {
        return {
            products: [
                {
                    id: 'test-product',
                    name: 'Test Product',
                    price: '0.00',
                    url: 'https://luhas.gratis/store/test-product',
                    description: 'This is a test product description.'
                }
            ]
        };
    }
};
</script>