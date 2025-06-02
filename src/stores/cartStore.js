import { defineStore } from 'pinia';
import { getProductById } from '../sanity.js';

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: []
    }),
    actions: {
        addToCart(product, selectedSize = null, quantity = 1, sizeKey = null) {
            if (product.sizesWithStock?.length > 0) {
                const sizeStock = product.sizesWithStock.find(size => size.size === selectedSize);

                if (sizeStock && sizeStock.stock >= quantity) {
                    const existingItem = this.items.find(item => item.id === product._id && item.size === selectedSize);
                    if (existingItem) {
                        const totalQuantity = existingItem.quantity + quantity;
                        if (totalQuantity <= sizeStock.stock) {
                            existingItem.quantity = totalQuantity;
                        } else {
                            existingItem.quantity = sizeStock.stock;
                        }
                    } else {
                        this.items.push({
                            id: product._id,
                            name: product.name,
                            price: product.price,
                            quantity: quantity,
                            size: selectedSize,
                            sizeKey: sizeKey, // Include sizeKey in the cart item
                            image: product.images[0],
                        });
                    }
                    sizeStock.stock -= quantity;
                }
            } else {
                // Product does not have sizes, so use general quantity
                if (product.quantity >= quantity) {
                    const existingItem = this.items.find(item => item.id === product._id && !item.size);
                    if (existingItem) {
                        const totalQuantity = existingItem.quantity + quantity;
                        if (totalQuantity <= product.quantity) {
                            existingItem.quantity = totalQuantity;
                        } else {
                            existingItem.quantity = product.quantity;
                        }
                    } else {
                        this.items.push({
                            id: product._id,
                            name: product.name,
                            price: product.price,
                            quantity: quantity,
                            image: product.images[0],
                        });
                    }
                    product.quantity -= quantity; // Reduce general quantity
                }
            }
        },
        async updateQuantity(productId, selectedSize = null, amount = 1) {
            const product = await getProductById(productId);
            let availableStock;

            if (selectedSize) {
                const sizeStock = product.sizesWithStock.find(size => size.size === selectedSize);
                availableStock = sizeStock ? sizeStock.stock : 0;
            } else {
                availableStock = product.quantity;
            }

            const item = this.items.find(item => item.id === productId && (item.size ?? null) === (selectedSize ?? null));

            if (item) {
                const newQuantity = item.quantity + amount;
                item.quantity = Math.min(Math.max(newQuantity, 1), availableStock); // Clamp quantity between 1 and availableStock
            }
        },
        removeFromCart(productId, selectedSize = null) {
            const itemIndex = this.items.findIndex(item => item.id === productId && (item.size ?? null) === (selectedSize ?? null));
            if (itemIndex !== -1) {
                this.items.splice(itemIndex, 1);
            }
        },
        clearCart() {
            this.items = [];
        },
    },
    getters: {
        cartTotal: (state) => {
            return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
        }
    }
});
