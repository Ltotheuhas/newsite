import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: []
    }),
    actions: {
        addToCart(product, selectedSize = null, quantity = 1) {
            // Check if the product has sizes with stock
            if (product.sizesWithStock?.length > 0) {
                const sizeStock = product.sizesWithStock.find(size => size.size === selectedSize);
                
                if (sizeStock && sizeStock.stock >= quantity) {
                    const existingItem = this.items.find(item => item.id === product._id && item.size === selectedSize);
                    if (existingItem) {
                        // Ensure the quantity does not exceed available stock
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
                            image: product.images[0],
                        });
                    }
                    sizeStock.stock -= quantity; // Reduce stock for the selected size
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
        updateQuantity(productId, selectedSize = null, amount = 1) {
            const item = this.items.find(item => item.id === productId && (item.size ?? null) === (selectedSize ?? null));
            if (item) {
                item.quantity += amount;
                console.log("New item quantity:", item.quantity);

                if (item.quantity <= 0) {
                    this.removeFromCart(productId, selectedSize);
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
