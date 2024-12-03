<template>
    <v-container>
        <v-row v-if="cartItems.length > 0">
            <v-col v-for="item in cartItems" :key="item.id" cols="12" md="8" offset-md="2">
                <v-card class="prodCard mb-4 pl-4 py-2">
                    <v-row no-gutters>
                        <v-col cols="4">
                            <v-img class="prodImg" :src="getImageUrl(item.image)"></v-img>
                        </v-col>
                        <v-col cols="8" class="d-flex flex-column pa-2 pb-0">
                            <v-card-title>{{ item.name }}</v-card-title>
                            <v-card-subtitle>
                                {{ formatCurrency(item.price) }}
                                <span v-if="item.size"> <span v-if="width > 600">-</span><br v-if="width < 600"> Size: {{ item.size }}</span>
                            </v-card-subtitle>
                            <v-spacer v-if="width > 600"></v-spacer>
                            <v-card-actions v-if="width > 600" class="pl-4">
                                <QuantitySelector :value="item.quantity" :maxQuantity="getMaxQuantity(item)" cols="4"
                                    @update:value="updateItemQuantity(item, $event)" />
                                <v-spacer></v-spacer>
                                <v-btn icon class="close-modal-btn align-end" @click="removeItem(item.id, item.size)">
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </v-card-actions>
                        </v-col>
                    </v-row>
                    <v-row v-if="width < 600" no-gutters>
                        <v-col cols="12">
                            <v-card-actions class="pb-0">
                                <QuantitySelector class="pa-0 pl-5" :value="item.quantity" :maxQuantity="getMaxQuantity(item)" cols="4"
                                    @update:value="updateItemQuantity(item, $event)" />
                                <v-spacer></v-spacer>
                                <v-btn icon class="close-modal-btn align-end pr-0" @click="removeItem(item.id, item.size)">
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </v-card-actions>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
        <p v-else>Your cart is empty.</p>
        <v-divider v-if="cartItems.length > 0"></v-divider>
        <div class="text-right mt-4" v-if="cartItems.length > 0">
            <h2>Total: {{ formatCurrency(cartTotal) }}</h2>
            <v-btn color="primary" large class="checkout-btn" @click="proceedToCheckout"
                :style="{ filter: `hue-rotate(${cartTotal}deg)` }">Proceed to
                Checkout</v-btn>
        </div>
    </v-container>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cartStore';
import { getProductById, urlFor } from '../sanity.js';
import QuantitySelector from '../components/QuantitySelector.vue';
import { useWindowSize } from '@vueuse/core'

export default {
    name: 'ShoppingCart',
    components: {
        QuantitySelector,
    },
    setup() {
        const router = useRouter();
        const cartStore = useCartStore();
        const cartItems = computed(() => cartStore.items);
        const cartTotal = computed(() => cartStore.cartTotal);

        const maxQuantities = ref({});

        const { width } = useWindowSize();

        onMounted(async () => {
            const maxQuantitiesObj = {};
            for (const item of cartItems.value) {
                const product = await getProductById(item.id);
                if (item.size) {
                    const sizeStock = product.sizesWithStock.find(size => size.size === item.size);
                    maxQuantitiesObj[item.id] = sizeStock ? sizeStock.stock : 1;
                } else {
                    maxQuantitiesObj[item.id] = product.quantity || 1;
                }
            }
            maxQuantities.value = maxQuantitiesObj;
        });

        const getMaxQuantity = (item) => maxQuantities.value[item.id] || 1;

        const formatCurrency = (value) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'EUR'
            }).format(value);
        };

        const getImageUrl = (imageRef) => {
            return imageRef ? urlFor(imageRef).url() : '';
        };

        const updateItemQuantity = (item, newQuantity) => {
            const maxQuantity = getMaxQuantity(item);
            const quantityChange = Math.min(newQuantity, maxQuantity) - item.quantity;
            cartStore.updateQuantity(item.id, item.size, quantityChange);
        };

        const removeItem = (productId, size) => {
            cartStore.removeFromCart(productId, size);
        };

        const proceedToCheckout = () => {
            router.push({ name: 'checkout' });
        };

        return {
            cartItems,
            cartTotal,
            formatCurrency,
            removeItem,
            proceedToCheckout,
            getImageUrl,
            updateItemQuantity,
            getMaxQuantity,
            width
        };
    },
};
</script>

<style scoped>
.close-modal-btn {
    background: transparent;
    color: white;
    mix-blend-mode: exclusion;
}

.checkout-btn {
    text-transform: none;
    border-radius: 4px;
    height: 50px;
}

::v-deep(.checkout-btn .v-btn__content) {
    font-family: 'Cabazon', sans-serif;
    font-size: 1.6em;
}

::v-deep(.v-btn:hover > .v-btn__overlay) {
    opacity: 0;
}

@media (max-width: 600px) {
    .prodCard {
        padding-top: 0 !important;
    }
}
</style>
