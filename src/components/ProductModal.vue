<template>
    <v-dialog v-model="isVisible" max-width="900px" @click:outside="close">
        <v-card class="product-modal-card" v-if="product">
            <v-btn icon class="close-modal-btn" @click="close">
                <v-icon>mdi-close</v-icon>
            </v-btn>

            <v-row class="product-modal-content" no-gutters>
                <v-col cols="12" md="6" class="product-image-section">
                    <v-row class="image-scroll-container ma-0" no-gutters>
                        <v-col v-for="(image, index) in product.images" :key="index" cols="12" class="scroll-image">
                            <v-img :src="urlFor(image).width(600).url()" />
                        </v-col>
                    </v-row>
                </v-col>

                <v-col cols="12" md="6" class="product-details">
                    <h3 class="product-title">
                        {{ product.name }}
                        <span v-if="product.preorder" class="preorder-label">(Pre-Order)</span>
                    </h3>
                    <div class="product-price">{{ formatCurrency(product.price) }}</div>
                    <div class="shipping-info">Shipping won't be calculated at checkout.</div>

                    <v-divider class="my-3"></v-divider>

                    <!-- Variant buttons + quantity selector (new schema) -->
                    <v-row v-if="hasVariants || maxQuantity > 1"
                        class="d-flex flex-wrap justify-space-between align-center">

                        <!-- variant toggle -->
                        <v-col v-if="hasVariants" cols="auto" class="d-flex justify-center">
                            <div class="my-2">
                                <v-btn-toggle v-model="selectedLabel" mandatory
                                    class="size-buttons d-flex flex-wrap justify-center" dense>
                                    <v-btn v-for="opt in options" :key="opt.label" :value="opt.label"
                                        :disabled="opt.stock === 0" :ripple="false">
                                        {{ opt.label }}
                                    </v-btn>
                                </v-btn-toggle>
                            </div>
                        </v-col>

                        <!-- quantity picker -->
                        <v-col v-if="maxQuantity > 1" cols="auto" class="d-flex justify-center selectorContainer">
                            <QuantitySelector :value="quantity" :maxQuantity="maxQuantity" :cols="12"
                                @update:value="quantity = $event" />
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col class="d-flex align-center justify-center" cols="12">
                            <v-btn color="primary" large block class="add-to-cart-btn" @click="handleAddToCart"
                                :disabled="isAddToCartDisabled" :style="{ filter: `hue-rotate(${product.price}deg)` }">
                                Add to cart
                            </v-btn>
                        </v-col>
                    </v-row>

                    <v-divider class="my-3"></v-divider>

                    <div class="description-scroll">
                        <div class="product-description">
                            <p v-html="formattedDescription"></p>

                            <div v-if="hasVariants && variantGroup?.name === 'Size'" class="size-chart">
                                <v-container class="px-0">
                                    <v-row class="size-grid">
                                        <v-col cols="4" class="size-header">Size</v-col>
                                        <v-col cols="4" class="size-header">Chest</v-col>
                                        <v-col cols="4" class="size-header">Length</v-col>
                                    </v-row>
                                    <v-row class="size-grid">
                                        <v-col cols="4">Small</v-col>
                                        <v-col cols="4">54</v-col>
                                        <v-col cols="4">66.5</v-col>
                                    </v-row>
                                    <v-row class="size-grid">
                                        <v-col cols="4">Medium</v-col>
                                        <v-col cols="4">57</v-col>
                                        <v-col cols="4">69</v-col>
                                    </v-row>
                                    <v-row class="size-grid">
                                        <v-col cols="4">Large</v-col>
                                        <v-col cols="4">60</v-col>
                                        <v-col cols="4">71.5</v-col>
                                    </v-row>
                                    <v-row class="size-grid">
                                        <v-col cols="4">X-Large</v-col>
                                        <v-col cols="4">63</v-col>
                                        <v-col cols="4">74</v-col>
                                    </v-row>
                                    <v-row class="size-grid">
                                        <v-col cols="4">2XL</v-col>
                                        <v-col cols="4">66</v-col>
                                        <v-col cols="4">76.5</v-col>
                                    </v-row>
                                </v-container>
                                <p>All sizes are in CM with a tolerance of +/- 3</p>
                                <p>Chest measurements are pit-to-pit</p>
                            </div>
                            <div v-else-if="product.name == 'CD'">
                                <v-btn prepend-icon="mdi-download" href="/downloads/download.zip" download class="mt-4">
                                    Digital Download
                                </v-btn>
                            </div>
                        </div>
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
        const quantity = ref(1);
        const selectedLabel = ref('');
        const isVisible = ref(props.isOpen);
        const dynamicHeight = ref(0);
        const carouselRef = ref(null);
        const activeSlideIndex = ref(0);
        const { width } = useWindowSize();
        const variantGroup = computed(() => props.product?.variantGroups?.[0]);
        const hasVariants = computed(() => Boolean(variantGroup.value));
        const options = computed(() => variantGroup.value?.options ?? []);

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
                if (hasVariants.value && options.value.length > 0) {
                    selectedLabel.value = options.value.find(o => o.stock > 0)?.label || '';
                } else {
                    selectedLabel.value = '';
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

        watch([selectedLabel, options], () => {
            const opt = options.value.find(o => o.label === selectedLabel.value);
            if (opt && quantity.value > opt.stock) quantity.value = opt.stock;
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
            if (hasVariants.value && selectedLabel.value) {
                const opt = options.value.find(o => o.label === selectedLabel.value);
                if (opt) {
                    const cartItem = cartStore.items.find(
                        i => i.id === props.product._id &&
                            i.variantLabel === selectedLabel.value
                    );
                    const remaining = opt.stock - (cartItem?.quantity ?? 0);
                    return remaining > 0 ? remaining : 1;
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
            emit('add-to-cart',
                props.product,
                selectedLabel.value || undefined,
                quantity.value);
            close();
        };

        const updateMaxQuantity = () => {
            if (quantity.value > maxQuantity.value) {
                quantity.value = maxQuantity.value;
            }
        };

        const formattedDescription = computed(() => {
            const desc = props.product?.description || '';
            return typeof desc === 'string' ? desc.replace(/\n/g, '<br>') : '';
        });

        const isAddToCartDisabled = computed(
            () => hasVariants.value && !selectedLabel.value
        );

        return {
            formatCurrency,
            close,
            handleAddToCart,
            maxQuantity,
            urlFor,
            updateMaxQuantity,
            isVisible,
            dynamicHeight,
            carouselRef,
            activeSlideIndex,
            onSlideChange,
            width,
            formattedDescription,
            isAddToCartDisabled,
            quantity,
            selectedLabel,
            hasVariants,
            options,
            variantGroup,
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
    display: flex;
    flex-direction: column;
    max-height: 60vh;
    overflow: hidden;
}

.description-scroll {
    flex-grow: 1;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 40vh;
    padding-right: 8px;
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
    justify-content: center;
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
    position: absolute;
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