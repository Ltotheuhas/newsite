/* ------------------------------------------------------------------ */
/*  Pinia cart store for new variant model                            */
/* ------------------------------------------------------------------ */

import { defineStore } from 'pinia'
import { getProductById } from '../sanity.js'

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: []                                // [{id, name, price, quantity, variantLabel?, image}]
    }),

    actions: {
        /**
         * Add a product to the cart.
         *
         * @param {Object}  product        – Sanity product doc (already fetched list view)
         * @param {String}  variantLabel   – Selected option label (“M”, “Red”, …) or null
         * @param {Number}  quantity       – Units to add (default 1)
         */
        addToCart(product, variantLabel = null, quantity = 1) {
            const hasVariants = Array.isArray(product.variantGroups) && product.variantGroups.length > 0
            const variantGroup = hasVariants ? product.variantGroups[0] : null
            const optionStock = hasVariants
                ? variantGroup.options.find(o => o.label === variantLabel)
                : null

            if (hasVariants) {
                if (!optionStock || optionStock.stock < quantity) return 

                const existing = this.items.find(
                    i => i.id === product._id && i.variantLabel === variantLabel
                )

                if (existing) {
                    const newQty = Math.min(existing.quantity + quantity, optionStock.stock)
                    existing.quantity = newQty
                } else {
                    this.items.push({
                        id: product._id,
                        name: product.name,
                        price: product.price,
                        quantity,
                        variantLabel,
                        variantName: variantGroup.name,
                        image: product.images?.[0]
                    })
                }

                optionStock.stock -= quantity          // optimistic local decrement
                return
            }

            if (product.quantity < quantity) return

            const existing = this.items.find(i => i.id === product._id && !i.variantLabel)

            if (existing) {
                existing.quantity = Math.min(existing.quantity + quantity, product.quantity)
            } else {
                this.items.push({
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    quantity,
                    image: product.images?.[0]
                })
            }
            product.quantity -= quantity
        },

        async updateQuantity(productId, variantLabel = null, amount = 1) {
            const product = await getProductById(productId)

            let availableStock
            if (variantLabel) {
                const group = product.variantGroups?.[0]
                const option = group?.options.find(o => o.label === variantLabel)
                availableStock = option ? option.stock : 0
            } else {
                availableStock = product.quantity
            }

            const item = this.items.find(
                i => i.id === productId && (i.variantLabel ?? null) === (variantLabel ?? null)
            )
            if (!item) return

            const newQty = Math.min(Math.max(item.quantity + amount, 1), availableStock)
            item.quantity = newQty
        },

        removeFromCart(productId, variantLabel = null) {
            const idx = this.items.findIndex(
                i => i.id === productId && (i.variantLabel ?? null) === (variantLabel ?? null)
            )
            if (idx !== -1) this.items.splice(idx, 1)
        },

        clearCart() {
            this.items = []
        }
    },

    getters: {
        cartTotal: state =>
            state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    }
})
