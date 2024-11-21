<template>
    <v-dialog v-model="isVisible" max-width="900px" @click:outside="close">
        <v-card class="product-modal-card" v-if="product">
            <v-row class="product-modal-content" no-gutters>
                <v-col cols="12" md="6" class="product-image-section">
                    <v-carousel hide-delimiters v-if="isMobile && product.images.length > 1" class="product-carousel">
                        <template v-slot:prev="{ props }">
                            <v-btn icon @click="props.onClick" :ripple="false" class="carouselBtn">
                                <v-icon>mdi-chevron-left</v-icon>
                            </v-btn>
                        </template>
                        <template v-slot:next="{ props }">
                            <v-btn icon @click="props.onClick" :ripple="false" class="carouselBtn">
                                <v-icon>mdi-chevron-right</v-icon>
                            </v-btn>
                        </template>
                        <v-carousel-item v-for="(image, index) in product.images" :key="index">
                            <v-img :src="urlFor(image).url()" cover />
                        </v-carousel-item>
                    </v-carousel>

                    <v-row v-else class="image-scroll-container ma-0" no-gutters>
                        <v-col v-for="(image, index) in product.images" :key="index" cols="12" class="scroll-image">
                            <v-img :src="urlFor(image).url()" />
                        </v-col>
                    </v-row>
                </v-col>

                <v-col cols="12" md="6" class="product-details">
                    <h3 class="product-title">
                        {{ product.name }}
                        <span class="preorder-label">(Pre-Order)</span>
                    </h3>
                    <div class="product-price">{{ formatCurrency(product.price) }}</div>
                    <div class="shipping-info">Shipping calculated at checkout.</div>

                    <v-divider class="my-3"></v-divider>

                    <div v-if="product.sizesWithStock && product.sizesWithStock.length > 0" class="my-2">
                        <v-btn-toggle v-model="selectedSize" class="size-buttons" dense>
                            <v-btn v-for="size in product.sizesWithStock.map((s) => s.size)" :key="size" :value="size"
                                :ripple="false">
                                {{ size }}
                            </v-btn>
                        </v-btn-toggle>
                    </div>

                    <QuantitySelector :value="selectedQuantity" :maxQuantity="maxQuantity" :cols="12"
                        @update:value="selectedQuantity = $event" />

                    <v-btn color="primary" large block class="add-to-cart-btn" @click="handleAddToCart">
                        Add to cart
                    </v-btn>

                    <v-divider class="my-3"></v-divider>

                    <div class="product-description">
                        <p>{{ product.description }}</p>
                    </div>
                </v-col>
            </v-row>
        </v-card>
    </v-dialog>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { useCartStore } from '../stores/cartStore';
import QuantitySelector from './QuantitySelector.vue';
import { urlFor } from '../sanity.js';

export default {
    name: 'ProductModal',
    components: { QuantitySelector },
    props: {
        product: Object,
        isOpen: Boolean,
    },
    emits: ['update:isOpen', 'add-to-cart'],
    setup(props, { emit }) {
        const cartStore = useCartStore();
        const selectedQuantity = ref(1);
        const selectedSize = ref(null);
        const isVisible = ref(props.isOpen);
        const isMobile = ref(false);

        // Detect mobile view
        const checkMobileView = () => {
            isMobile.value = window.innerWidth <= 960;
        };

        onMounted(() => {
            checkMobileView();
            window.addEventListener('resize', checkMobileView);
        });

        watch(() => props.product, (newProduct) => {
            if (newProduct) {
                if (newProduct.sizesWithStock && newProduct.sizesWithStock.length > 0) {
                    selectedSize.value = newProduct.sizesWithStock[0].size;
                } else {
                    selectedSize.value = null;
                }
            }
        });

        watch(selectedSize, (newSize) => {
            if (props.product.sizesWithStock) {
                const sizeStock =
                    props.product.sizesWithStock.find(
                        (size) => size.size === newSize
                    )?.stock || 1;

                if (selectedQuantity.value > sizeStock) {
                    selectedQuantity.value = sizeStock;
                }
            }
        });

        const formatCurrency = (value) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'EUR',
            }).format(value);
        };

        const close = () => {
            isVisible.value = false;
            emit('update:isOpen', false);
        };

        const maxQuantity = computed(() => {
            if (!props.product) return 1;
            if (props.product.sizesWithStock?.length > 0 && selectedSize.value) {
                const sizeStock = props.product.sizesWithStock.find(
                    (size) => size.size === selectedSize.value
                );
                if (sizeStock) {
                    const cartItem = cartStore.items.find(
                        (item) =>
                            item.id === props.product._id &&
                            item.size === selectedSize.value
                    );
                    const availableStock = cartItem
                        ? sizeStock.stock - cartItem.quantity
                        : sizeStock.stock;
                    return availableStock > 0 ? availableStock : 1;
                }
            } else if (props.product.quantity) {
                const cartItem = cartStore.items.find(
                    (item) => item.id === props.product._id
                );
                const availableStock = cartItem
                    ? props.product.quantity - cartItem.quantity
                    : props.product.quantity;
                return availableStock > 0 ? availableStock : 1;
            }
            return 1;
        });

        const handleAddToCart = () => {
            const sizeKey = productHasSizes.value
                ? props.product.sizesWithStock.find(
                    (size) => size.size === selectedSize.value
                )?._key
                : null;

            emit(
                'add-to-cart',
                props.product,
                selectedQuantity.value,
                selectedSize.value,
                sizeKey
            );
            close();
        };

        const productHasSizes = computed(
            () =>
                props.product?.sizesWithStock &&
                props.product.sizesWithStock.length > 0
        );

        const updateMaxQuantity = () => {
            if (selectedQuantity.value > maxQuantity.value) {
                selectedQuantity.value = maxQuantity.value;
            }
        };

        watch(
            () => props.isOpen,
            (newVal) => {
                isVisible.value = newVal;
            }
        );

        return {
            selectedQuantity,
            selectedSize,
            formatCurrency,
            close,
            handleAddToCart,
            maxQuantity,
            productHasSizes,
            urlFor,
            updateMaxQuantity,
            isVisible,
            isMobile,
        };
    },
};
</script>

<style scoped>
.product-modal-card {
    max-height: 60vh;
    background-color: #121212;
    color: #ffffff;
    display: flex;
    flex-direction: row;
    overflow: hidden;
}

.product-image-section {
    max-height: 60vh;
    overflow-y: auto;
    padding-right: 16px;
    border-right: 1px solid #444;
}

.image-scroll-container {
    display: flex;
    flex-direction: column;
}

.scroll-image {
    display: flex;
    justify-content: center;
    padding: 0;
}

.product-carousel {
    max-height: 400px;
    overflow: hidden;
}

.v-carousel-item {
    display: flex;
    justify-content: center;
    align-items: center;
}

.carouselBtn {
    background: transparent;
    box-shadow: none;
    mix-blend-mode: exclusion;
}

.product-details {
    padding: 16px !important;
}

.product-title {
    font-weight: bold;
    font-size: 1.5rem;
    color: #ffffff;
}

.preorder-label {
    font-weight: normal;
    font-size: 1rem;
    color: #aaaaaa;
}

.product-price {
    font-size: 1.2rem;
    margin-top: 10px;
    color: #ffffff;
}

.shipping-info {
    font-size: 0.9rem;
    color: #888888;
}

.size-buttons {
    display: flex;
}

.size-buttons .v-btn {
    color: #ffffff;
    background-color: #333333;
    border: 1px solid #444444;
}

.size-buttons .v-btn--selected {
    background-color: #555555;
}

.add-to-cart-btn {
    background-color: #444444;
    color: #ffffff;
    border-radius: 20px;
    margin-top: 16px;
    text-transform: none;
}

.product-description {
    font-size: 0.85rem;
    color: #bbbbbb;
}

.v-divider {
    width: 108%;
    margin-left: -16px;
}

@media (max-width: 960px) {
    .product-modal-card {
        max-height: 85vh;
    }

    .product-image-section {
        max-height: 600px;
        overflow-y: hidden;
        overflow-x: auto;
    }

    .image-scroll-container {
        max-height: inherit;
        scroll-behavior: smooth;
        display: flex;
        flex-direction: column;
    }

    .scroll-image .v-img {
        height: auto !important;
    }

    .size-buttons {
        overflow-x: auto;
        display: flex;
        flex-wrap: nowrap;
    }
}
</style>