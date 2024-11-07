<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="8" offset-md="2">
                <div v-if="cartItems.length > 0">
                    <h2>Order Summary</h2>
                    <v-list>
                        <v-list-item v-for="item in cartItems" :key="item.id">
                            <v-list-item-content>
                                <v-list-item-title>
                                    {{ item.name }} <span v-if="item.size"> - {{ item.size }}</span>
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    {{ formatCurrency(item.price) }}
                                    <span v-if="item.quantity > 1">
                                        x {{ item.quantity }}
                                    </span>
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                    <h3>Total: {{ formatCurrency(cartTotal) }}</h3>
                </div>
                <v-form ref="checkoutForm" @submit.prevent="submitPayment">
                    <div id="address-element" class="address-container"></div>
                    <div id="payment-element" class="payment-container"></div>
                    <v-alert v-if="errorMessage" type="error" dismissible>
                        {{ errorMessage }}
                    </v-alert>
                    <div class="d-flex justify-space-between mt-4">
                        <v-btn :loading="loading" color="primary" @click="submitPayment">Confirm Payment</v-btn>
                        <v-btn text @click="$router.push('/store/cart')">Back to Cart</v-btn>
                    </div>
                </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useCartStore } from '../stores/cartStore';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51QHPQZBmSyJV72ZkDjAOJy4FTCntA2ZvRidQ0fwAuoGtCQMfl5inUxs0NpqocyG4CUE1AHOj5LnlxlbDemQG3VXK00Fs7s5ir0');

export default {
    name: 'CheckoutView',
    setup() {
        const cartStore = useCartStore();
        const cartItems = computed(() => cartStore.items);
        const cartTotal = computed(() => cartStore.cartTotal);

        const customerName = ref('');
        const stripe = ref(null);
        const elements = ref(null);
        const loading = ref(false);
        const clientSecret = ref(null);
        const errorMessage = ref(null);

        onMounted(async () => {
            try {
                stripe.value = await stripePromise;

                // Send items to create-payment-intent and fetch clientSecret
                const itemsPayload = cartItems.value.map(item => {
                    const sizeEntry = item.sizesWithStock
                        ? item.sizesWithStock.find(sizeStock => sizeStock.size === item.size)
                        : null;

                    return {
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        ...(sizeEntry ? { size: sizeEntry.size, sizeKey: sizeEntry._key } : {})
                    };
                });

                const response = await fetch(`${window.location.origin}/create-payment-intent`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ items: itemsPayload }),
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch payment intent.");
                }

                const data = await response.json();
                clientSecret.value = data.clientSecret;

                const appearance = {
                    theme: 'flat',
                    variables: {
                        fontFamily: 'Verdana',
                        fontLineHeight: '1.5',
                        borderRadius: '0',
                        colorBackground: 'transparent',
                        colorText: '#6c6d78',
                        focusBoxShadow: 'none',
                        focusOutline: '-webkit-focus-ring-color auto 1px',
                        tabIconSelectedColor: 'var(--colorText)'
                    },
                    rules: {
                        '.Input, .CheckboxInput, .CodeInput': {
                            transition: 'none',
                            boxShadow: 'inset -1px -1px #ffffff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px #808080',
                            color: 'var(--colorText)'
                        },
                        '.Input': {
                            padding: '12px'
                        },
                        '.Input--invalid': {
                            color: '#DF1B41'
                        },
                        '.Tab, .Block, .PickerItem--selected': {
                            backgroundColor: '#dfdfdf',
                            boxShadow: 'inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf'
                        },
                        '.Tab:hover': {
                            backgroundColor: '#eee'
                        },
                        '.Tab--selected': {
                            color: 'var(--colorText)',
                            backgroundColor: '#ccc'
                        }
                    }
                };

                elements.value = stripe.value.elements({ clientSecret: clientSecret.value, appearance });

                const addressElement = elements.value.create('address', { mode: 'shipping' });
                addressElement.mount('#address-element');

                const paymentElement = elements.value.create('payment');
                paymentElement.mount('#payment-element');
            } catch (error) {
                errorMessage.value = error.message;
            }
        });

        const formatCurrency = (value) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'EUR'
            }).format(value);
        };

        const submitPayment = async () => {
            loading.value = true;

            const { error } = await stripe.value.confirmPayment({
                elements: elements.value,
                confirmParams: {
                    return_url: `${window.location.origin}/store/confirmation`,
                    payment_method_data: {
                        billing_details: {
                            name: customerName.value,
                        }
                    }
                }
            });

            if (error) {
                errorMessage.value = error.message;
            } else {
                cartStore.clearCart(); // Clear cart since webhook handles inventory updates
            }

            loading.value = false;
        };

        return {
            cartItems,
            cartTotal,
            customerName,
            formatCurrency,
            submitPayment,
            loading,
            errorMessage
        };
    }
};
</script>

<style scoped>
.payment-container,
.address-container {
    margin-top: 16px;
}

#payment-element *:focus,
#address-element *:focus {
    outline: none;
}
</style>