<template>
    <v-dialog v-model="isVisible" max-width="900px" @click:outside="close">
        <v-card class="product-modal-card" v-if="product">
            <v-btn icon class="close-modal-btn" @click="close">
                <v-icon>mdi-close</v-icon>
            </v-btn>

            <v-row class="product-modal-content" no-gutters>
                <v-col cols="12" md="6" class="product-image-section">
                    <v-carousel ref="carouselRef" hide-delimiters v-if="width < 960 && product.images.length > 1"
                        class="product-carousel" v-model="activeSlideIndex" @input="onSlideChange">
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
                            <v-img :style="{ height: `${dynamicHeight}px` }" :src="urlFor(image).width(600).url()" cover />
                        </v-carousel-item>
                    </v-carousel>

                    <v-row v-else class="image-scroll-container ma-0" no-gutters>
                        <v-col v-for="(image, index) in product.images" :key="index" cols="12" class="scroll-image">
                            <v-img :src="urlFor(image).width(600).url()" />
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
                    <v-row>
                        <v-col class="d-flex align-center selectorContainer" cols="12" sm="4">
                            <QuantitySelector :value="selectedQuantity" :maxQuantity="maxQuantity" :cols="12"
                                @update:value="selectedQuantity = $event" />
                        </v-col>
                        <v-col class="d-flex align-center" cols="12" sm="8">
                            <v-btn color="primary" large block class="add-to-cart-btn" @click="handleAddToCart"
                                :style="{ filter: `hue-rotate(${product.price}deg)` }">
                                Add to cart
                            </v-btn>
                        </v-col>
                    </v-row>

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
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useCartStore } from '../stores/cartStore';
import QuantitySelector from './QuantitySelector.vue';
import { urlFor } from '../sanity.js';
import { useWindowSize } from '@vueuse/core'

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
        const dynamicHeight = ref(0);
        const carouselRef = ref(null);
        const activeSlideIndex = ref(0);
        const { width } = useWindowSize();

        const calculateHeight = () => {
            nextTick(() => {
                const carouselElement = carouselRef.value?.$el; // Access DOM element
                if (carouselElement) {
                    const carouselItems = carouselElement.querySelectorAll('.v-carousel-item');
                    if (carouselItems[activeSlideIndex.value]) {
                        dynamicHeight.value = carouselItems[activeSlideIndex.value].offsetWidth || 0;
                    }
                }
            });
        };

        const onSlideChange = (index) => {
            activeSlideIndex.value = index;
            calculateHeight(); // Recalculate height for the new active slide
        };

        onMounted(() => {
            calculateHeight();
            window.addEventListener('resize', calculateHeight);
        });

        onBeforeUnmount(() => {
            window.removeEventListener('resize', calculateHeight);
        });

        watch(() => props.product, async (newProduct) => {
            if (newProduct) {
                await nextTick();
                calculateHeight();
                if (newProduct.sizesWithStock && newProduct.sizesWithStock.length > 0) {
                    selectedSize.value = newProduct.sizesWithStock[0].size;
                } else {
                    selectedSize.value = null;
                }
            }
        });

        watch(() => props.isOpen, async (newVal) => {
            isVisible.value = newVal;
            if (newVal) {
                await nextTick();
                calculateHeight();
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
            dynamicHeight,
            carouselRef,
            activeSlideIndex,
            onSlideChange,
            width
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
    height: auto !important;
    overflow: hidden;
}

.v-carousel-item {
    display: flex;
    justify-content: center;
    align-items: center;
}

.carouselBtn {
    color: white;
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
    text-transform: none;
    border-radius: 4px;
    height: 50px;
}

::v-deep(.add-to-cart-btn .v-btn__content) {
    font-family: 'Cabazon', sans-serif;
    font-size: 1.6em;
}

::v-deep(.v-btn:hover > .v-btn__overlay) {
    opacity: 0;
}

.product-description {
    font-size: 0.85rem;
    color: #bbbbbb;
}

.v-divider {
    width: 108%;
    margin-left: -16px;
}

.close-modal-btn {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 10;
    background: transparent;
    color: white;
    mix-blend-mode: exclusion;
}

@media (max-width: 960px) {
    .product-modal-card {
        max-height: 85vh;
    }

    .product-image-section {
        max-height: none;
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

    .selectorContainer {
        padding: 0;
    }
}

@media (max-width: 600px) {
    .selectorContainer {
        justify-content: center;
        padding-top: 16px;
    }
}
</style>