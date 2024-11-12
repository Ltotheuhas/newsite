<template>
    <v-dialog v-model="isVisible" max-width="900px" @click:outside="close">
        <v-card class="product-modal-card" v-if="product">
            <v-row class="product-modal-content" no-gutters>
                <!-- Image Section -->
                <v-col cols="12" md="6" class="product-image-section">
                    <!-- Main Image -->
                    <v-img :src="urlFor(selectedImage).width(600).url()" cover height="400px" class="main-image" />

                    <!-- Thumbnails Row (Only shows if there are multiple images) -->
                    <v-row v-if="product.images.length > 1" class="thumbnails ma-0 pa-2" align="center"
                        justify="center">
                        <v-col v-for="(image, index) in product.images" :key="index" cols="4" class="thumbnail">
                            <v-img :src="urlFor(image).width(100).url()" @click="selectImage(image)"
                                :class="{ 'selected-thumbnail': selectedImage === image }" />
                        </v-col>
                    </v-row>
                </v-col>

                <!-- Product Details Section -->
                <v-col cols="12" md="6" class="product-details">
                    <h3 class="product-title">{{ product.name }} <span class="preorder-label">(Pre-Order)</span></h3>
                    <div class="product-price">{{ formatCurrency(product.price) }}</div>
                    <div class="shipping-info">Shipping calculated at checkout.</div>

                    <v-divider class="my-3"></v-divider>

                    <!-- Conditionally Render Size Selection -->
                    <div v-if="product.sizesWithStock && product.sizesWithStock.length > 0" class="my-2">
                        <label>Size</label>
                        <v-btn-toggle v-model="selectedSize" class="size-buttons" dense>
                            <v-btn v-for="size in product.sizesWithStock.map(s => s.size)" :key="size" :value="size"
                                :ripple="false">
                                {{ size }}
                            </v-btn>
                        </v-btn-toggle>
                    </div>

                    <!-- Quantity Selector -->
                    <label class="quantity-label">Quantity</label>
                    <QuantitySelector :value="selectedQuantity" :maxQuantity="maxQuantity" :cols="12"
                        @update:value="selectedQuantity = $event" />

                    <v-btn color="primary" large block class="add-to-cart-btn" @click="handleAddToCart">Add to
                        cart</v-btn>

                    <v-divider class="my-3 "></v-divider>

                    <div class="product-description">
                        <p>{{ product.description }}</p>
                    </div>
                </v-col>
            </v-row>
        </v-card>
    </v-dialog>
</template>

<script>
import { ref, computed, watch } from 'vue';
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
        const selectedImage = ref(null);

        // Watch for changes in product to set default size and selected image
        watch(() => props.product, (newProduct) => {
            if (newProduct) {
                // Set default selected image
                selectedImage.value = newProduct.images && newProduct.images.length > 0 ? newProduct.images[0] : null;

                // Set default selected size if sizes are available
                if (newProduct.sizesWithStock && newProduct.sizesWithStock.length > 0) {
                    selectedSize.value = newProduct.sizesWithStock[0].size;
                } else {
                    selectedSize.value = null; // No sizes available
                }
            }
        });

        // Watch for changes in selectedSize and adjust selectedQuantity if needed
        watch(selectedSize, (newSize) => {
            if (props.product.sizesWithStock) {  // Check if sizesWithStock exists
                const sizeStock = props.product.sizesWithStock.find(size => size.size === newSize)?.stock || 1;

                // If selectedQuantity exceeds stock of new size, adjust selectedQuantity
                if (selectedQuantity.value > sizeStock) {
                    selectedQuantity.value = sizeStock;
                }
            }
        });

        const formatCurrency = (value) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'EUR'
            }).format(value);
        };

        const close = () => {
            isVisible.value = false;
            emit('update:isOpen', false);
        };

        const maxQuantity = computed(() => {
            if (!props.product) return 1;
            if (props.product.sizesWithStock?.length > 0 && selectedSize.value) {
                const sizeStock = props.product.sizesWithStock.find(size => size.size === selectedSize.value);
                if (sizeStock) {
                    const cartItem = cartStore.items.find(item => item.id === props.product._id && item.size === selectedSize.value);
                    const availableStock = cartItem ? sizeStock.stock - cartItem.quantity : sizeStock.stock;
                    return availableStock > 0 ? availableStock : 1;
                }
            } else if (props.product.quantity) {
                const cartItem = cartStore.items.find(item => item.id === props.product._id);
                const availableStock = cartItem ? props.product.quantity - cartItem.quantity : props.product.quantity;
                return availableStock > 0 ? availableStock : 1;
            }
            return 1;
        });

        const handleAddToCart = () => {
            const sizeKey = productHasSizes.value
                ? props.product.sizesWithStock.find(size => size.size === selectedSize.value)?._key
                : null;

            emit('add-to-cart', props.product, selectedQuantity.value, selectedSize.value, sizeKey);
            close();
        };

        const productHasSizes = computed(() => props.product?.sizesWithStock && props.product.sizesWithStock.length > 0);

        const updateMaxQuantity = () => {
            if (selectedQuantity.value > maxQuantity.value) {
                selectedQuantity.value = maxQuantity.value;
            }
        };

        const selectImage = (image) => {
            selectedImage.value = image; // Update the main image when a thumbnail is clicked
        };

        // Sync local `isVisible` with prop `isOpen`
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
            selectedImage,
            selectImage,
        };
    },
};
</script>

<style scoped>
.product-modal-card {
    background-color: #121212;
    color: #ffffff;
}

.product-image-section {
    padding-right: 16px;
}

.main-image {
    border: 1px solid #444;
}

.thumbnails {
    border-right: 1px solid #444;
}

.thumbnail .v-img {
    cursor: pointer;
    border-right: 1px solid #444;
    transition: border-color 0.3s;
}

.selected-thumbnail {
    transition: 0.3s;
    filter: invert(1);
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

.quantity-label {
    margin-top: 16px;
    font-weight: 500;
    color: #ffffff;
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
</style>