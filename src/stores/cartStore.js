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
                            alert(`Only ${sizeStock.stock} items available in size ${selectedSize}.`);
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

                        // Log the item added to the cart
                        console.log("Item added to cart:", {
                            id: product._id,
                            name: product.name,
                            size: selectedSize,
                            sizeKey: sizeKey,
                            quantity
                        });
                    }
                    sizeStock.stock -= quantity;
                } else {
                    alert('Selected size is out of stock or insufficient stock.');
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
                            alert(`Only ${product.quantity} items available.`);
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
                } else {
                    alert('Product is out of stock or insufficient stock.');
                }
            }
        },
        async updateQuantity(productId, selectedSize = null, amount = 1) {
            // Fetch product data from Sanity
            const product = await getProductById(productId);

            let availableStock;

            if (selectedSize) {
                const sizeStock = product.sizesWithStock.find(size => size.size === selectedSize);
                availableStock = sizeStock ? sizeStock.stock : 0;
            } else {
                availableStock = product.quantity;
            }

            // Find the item in the cart
            const item = this.items.find(item => item.id === productId && (item.size ?? null) === (selectedSize ?? null));

            if (item) {
                // Check if the new quantity exceeds available stock
                const newQuantity = item.quantity + amount;
                if (newQuantity > availableStock) {
                    alert(`Only ${availableStock} items available${selectedSize ? ` for size ${selectedSize}` : ''}.`);
                    item.quantity = availableStock; // Set to max available stock
                } else if (newQuantity <= 0) {
                    this.removeFromCart(productId, selectedSize); // Remove item if quantity goes below 1
                } else {
                    item.quantity = newQuantity;
                }
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
            this.orderDetails = null;
        },
        setOrderDetails(details) {
            this.orderDetails = details;
        },
    },
    getters: {
        cartTotal: (state) => {
            return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
        }
    }
});
