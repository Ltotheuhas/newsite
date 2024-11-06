<template>
    <v-container>
        <h1>Checkout</h1>
        <v-row>
            <v-col cols="12" md="8" offset-md="2">
                <div v-if="cartItems.length > 0">
                    <h2>Order Summary</h2>
                    <v-list>
                        <v-list-item v-for="item in cartItems" :key="item.id">
                            <v-list-item-content>
                                <v-list-item-title>{{ item.name }} - {{ item.size || "Standard" }}</v-list-item-title>
                                <v-list-item-subtitle>{{ formatCurrency(item.price) }} x {{ item.quantity
                                    }}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                    <h3>Total: {{ formatCurrency(cartTotal) }}</h3>
                </div>
                <v-form ref="checkoutForm" @submit.prevent="submitPayment">
                    <v-text-field label="Full Name" v-model="customerName" required
                        :rules="[v => !!v || 'Full name is required']"></v-text-field>
                    <v-text-field label="Address" v-model="address" required></v-text-field>
                    <v-text-field label="City" v-model="city" required></v-text-field>
                    <v-text-field label="Postal Code" v-model="postalCode" required></v-text-field>

                    <!-- Stripe Payment Element -->
                    <div id="payment-element" class="payment-container"></div>

                    <!-- Error message alert -->
                    <v-alert v-if="errorMessage" type="error" dismissible>
                        {{ errorMessage }}
                    </v-alert>

                    <!-- Buttons -->
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
import { useRouter } from 'vue-router';

const stripePromise = loadStripe('pk_test_51QHPQZBmSyJV72ZkDjAOJy4FTCntA2ZvRidQ0fwAuoGtCQMfl5inUxs0NpqocyG4CUE1AHOj5LnlxlbDemQG3VXK00Fs7s5ir0');

export default {
    name: 'CheckoutView',
    setup() {
        const cartStore = useCartStore();
        const cartItems = computed(() => cartStore.items);
        const cartTotal = computed(() => cartStore.cartTotal);

        const customerName = ref('');
        const address = ref('');
        const city = ref('');
        const postalCode = ref('');
        const stripe = ref(null);
        const elements = ref(null);
        const loading = ref(false);
        const clientSecret = ref(null);
        const errorMessage = ref(null);
        const router = useRouter();

        onMounted(async () => {
            try {
                stripe.value = await stripePromise;

                const response = await fetch(`${window.location.origin}/create-payment-intent`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ items: cartItems.value }),
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
                        colorBackground: 'transparent', // Set to transparent
                        focusBoxShadow: 'none',
                        focusOutline: '-webkit-focus-ring-color auto 1px',
                        tabIconSelectedColor: 'var(--colorText)'
                    },
                    rules: {
                        '.Input, .CheckboxInput, .CodeInput': {
                            transition: 'none',
                            boxShadow: 'inset -1px -1px #ffffff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px #808080',
                            backgroundColor: 'transparent' // Ensure input fields are transparent
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
                        '.Tab': {
                            transition: 'none'
                        },
                        '.Tab:hover': {
                            backgroundColor: '#eee'
                        },
                        '.Tab--selected, .Tab--selected:focus, .Tab--selected:hover': {
                            color: 'var(--colorText)',
                            backgroundColor: '#ccc'
                        },
                        '.PickerItem': {
                            backgroundColor: '#dfdfdf',
                            boxShadow: 'inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf',
                            transition: 'none'
                        }
                    }
                };

                elements.value = stripe.value.elements({ clientSecret: clientSecret.value, appearance });

                const paymentElement = elements.value.create('payment');
                paymentElement.mount('#payment-element');
            } catch (error) {
                errorMessage.value = error.message;
            }
        });

        const formatCurrency = (value) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(value);
        };

        const submitPayment = async () => {
            loading.value = true;
            const { error } = await stripe.value.confirmPayment({
                elements: elements.value,
                confirmParams: {
                    payment_method_data: {
                        billing_details: {
                            name: customerName.value,
                            address: {
                                line1: address.value,
                                city: city.value,
                                postal_code: postalCode.value,
                            }
                        }
                    }
                }
            });

            if (error) {
                errorMessage.value = error.message;
            } else {
                cartStore.clearCart();
                router.push('/store/confirmation');
            }
            loading.value = false;
        };

        return {
            cartItems,
            cartTotal,
            customerName,
            address,
            city,
            postalCode,
            formatCurrency,
            submitPayment,
            loading,
            errorMessage
        };
    }
};
</script>

<style scoped>
.payment-container {
    margin-top: 16px;
}

#payment-element *:focus {
    outline: none;
}
</style>