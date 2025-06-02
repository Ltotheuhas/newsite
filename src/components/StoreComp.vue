<template>
    <!-- The container fills the available space -->
    <div ref="container" class="carousel-container">
        <!-- Render only after products have loaded -->
        <div v-if="products.length" ref="track" :class="['carousel-track', { animate: readyToScroll }]">
            <!-- Build the scrolling list: one block repeated twice for seamless looping -->
            <div v-for="(product, index) in repeatedProducts" :key="index" class="carousel-item">
                <v-card class="mx-2 product-card">
                    <!-- Listen to load events on images from the first block -->
                    <v-img :src="mainImage(product)" height="150px" @load="onImageLoad" />
                    <v-card-title class="product-title">{{ product.name }}</v-card-title>
                    <v-card-subtitle class="product-price pb-2">
                        {{ formatCurrency(product.price) }}
                    </v-card-subtitle>
                </v-card>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, nextTick } from 'vue';
import { getProducts, urlFor } from '../sanity.js';

export default {
    name: 'StoreCarousel',
    setup() {
        const products = ref([]);
        const container = ref(null);
        const track = ref(null);
        // Flag to start the scrolling animation
        const readyToScroll = ref(false);
        // Count the number of image load events from the first block
        const imagesLoadedCount = ref(0);
        // blockCount determines how many times the original product list should be repeated in one block
        const blockCount = ref(1);

        // Fetch products from sanity
        const fetchProducts = async () => {
            products.value = await getProducts();
        };

        // Compute one "block" of products:
        // This repeats the original product list blockCount times.
        const blockProducts = computed(() => {
            if (!products.value.length) return [];
            let arr = [];
            for (let i = 0; i < blockCount.value; i++) {
                arr = arr.concat(products.value);
            }
            return arr;
        });

        // Final repeated list is two copies of the blockProducts (to allow seamless scroll)
        const repeatedProducts = computed(() => {
            return blockProducts.value.length
                ? blockProducts.value.concat(blockProducts.value)
                : [];
        });

        // Format a number as currency
        const formatCurrency = (value) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'EUR',
            }).format(value);
        };

        // Return the URL for the product's main image
        const mainImage = (product) => {
            return product.images && product.images[0]
                ? urlFor(product.images[0]).width(400).url()
                : null;
        };

        // Each image load event (only count images from the first block)
        const onImageLoad = () => {
            // Only count up to the number of items in the blockProducts (the first block)
            if (imagesLoadedCount.value < blockProducts.value.length) {
                imagesLoadedCount.value++;
            }
            // Once all images in the first block are loaded, adjust the block replication if needed
            if (imagesLoadedCount.value >= blockProducts.value.length && !readyToScroll.value) {
                adjustBlock();
            }
        };

        // Measure widths and adjust blockCount if necessary
        const adjustBlock = () => {
            nextTick(() => {
                if (container.value && track.value) {
                    // The container fills the available space (its width is set via CSS as 100%)
                    const availableWidth = container.value.clientWidth;
                    // Since repeatedProducts = block + block, one block’s width is half the track's total width
                    let blockWidth = track.value.offsetWidth / 2;

                    // If the block's width is less than the available width, increase blockCount so it fills the space
                    if (blockWidth < availableWidth) {
                        const factor = Math.ceil(availableWidth / blockWidth);
                        if (factor > blockCount.value) {
                            blockCount.value = factor;
                            // Reset the imagesLoadedCount so that adjustBlock will run again after re-rendering
                            imagesLoadedCount.value = 0;
                            // Wait for re-render and images to load again before adjusting further
                            nextTick(() => {
                                // Let the onImageLoad events eventually trigger adjustBlock again.
                                setTimeout(adjustBlock, 500);
                            });
                            return;
                        }
                    }
                    // Set a CSS variable for the scroll animation (the block width)
                    container.value.style.setProperty('--block-width', `${blockWidth}px`);
                    readyToScroll.value = true;
                }
            });
        };

        onMounted(async () => {
            await fetchProducts();
            // Wait for the products to render and then adjust.
            nextTick(() => {
                // In case images are cached and load events don't all fire, use a fallback adjustment.
                setTimeout(adjustBlock, 1000);
            });
        });

        // Optionally, watch for window resize to re-calculate the block if needed.
        window.addEventListener('resize', () => {
            readyToScroll.value = false;
            // Reset block count and image load counter
            blockCount.value = 1;
            imagesLoadedCount.value = 0;
            nextTick(() => {
                adjustBlock();
            });
        });

        return {
            products,
            repeatedProducts,
            formatCurrency,
            mainImage,
            readyToScroll,
            container,
            track,
            onImageLoad,
        };
    },
};
</script>

<style scoped>
.carousel-container {
    overflow: hidden;
    width: 100%;
    padding: 16px 0;
    /* Apply a mask that fades out the left and right edges */
    -webkit-mask-image: linear-gradient(to right,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%);
    mask-image: linear-gradient(to right,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%);
}

/* The track’s width is dictated by its content.
     The CSS variable --block-width is used to determine the scroll distance. */
.carousel-track {
    display: flex;
    width: fit-content;
}

/* Apply the scroll animation once everything is ready */
.carousel-track.animate {
    animation: scroll 15s linear infinite;
}

.carousel-item {
    flex: none;
    margin-right: 16px;
}

/* The scroll animation moves the track left by the measured block width */
@keyframes scroll {
    0% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(calc(-1 * var(--block-width, 100%)));
    }
}

.product-card {
    width: 200px;
}

.product-title {
    font-weight: bold;
    font-size: 1rem;
}

.product-price {
    color: #666;
    font-size: 0.9rem;
}
</style>