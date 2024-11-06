<template>
    <v-container>
        <h1>Checkout</h1>
        <v-row>
            <v-col cols="12" md="8" offset-md="2">
                <!-- Cart Summary -->
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
                <!-- Checkout Form -->
                <v-form ref="checkoutForm" @submit.prevent="submitPayment">
                    <v-text-field label="Full Name" v-model="customerName" required
                        :rules="[v => !!v || 'Full name is required']"></v-text-field>
                    <v-text-field label="Address" v-model="address" required></v-text-field>
                    <v-text-field label="City" v-model="city" required></v-text-field>
                    <v-text-field label="Postal Code" v-model="postalCode" required></v-text-field>

                    <!-- Stripe Payment Element -->
                    <div id="payment-element"><!-- Stripe Payment Element mounts here --></div>

                    <v-alert v-if="errorMessage" type="error" dismissible>
                        {{ errorMessage }}
                    </v-alert>

                    <v-btn :loading="loading" color="primary" @click="submitPayment">Confirm Payment</v-btn>
                    <v-btn text @click="$router.push('/store/cart')">Back to Cart</v-btn>
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
            console.log("onMounted hook triggered");  // Initial log

            try {
                stripe.value = await stripePromise;
                console.log("Stripe initialized");

                const response = await fetch(`${window.location.origin}/create-payment-intent`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ items: cartItems.value }),
                });

                console.log("Fetch response received:", response);

                if (!response.ok) {
                    console.error("Failed to fetch payment intent:", response.statusText);
                    throw new Error("Network response was not ok");
                }

                const data = await response.json();
                console.log("Payment intent data:", data);

                clientSecret.value = data.clientSecret;

                const options = {
                    clientSecret: clientSecret.value,
                    appearance: {
                        theme: 'flat',
                        variables: {
                            colorPrimary: '#1976d2',
                            colorText: '#ffffff',
                            fontFamily: 'Roboto, sans-serif',
                            fontSizeBase: '16px',
                            spacingUnit: '4px',
                            borderRadius: '4px',
                        },
                    }
                };

                elements.value = stripe.value.elements(options);

                const paymentElement = elements.value.create('payment');
                paymentElement.mount('#payment-element');

                console.log("Payment Element mounted successfully");
            } catch (error) {
                console.error("Error in onMounted:", error);
            }
        });

        const formatCurrency = (value) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(value);
        };

        const submitPayment = async () => {
            if (!stripe.value || !elements.value) {
                console.error("Stripe has not been properly initialized.");
                return;
            }

            loading.value = true;

            const { error, paymentIntent } = await stripe.value.confirmPayment({
                elements: elements.value,
                confirmParams: {
                    return_url: null,
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
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
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
            loading
        };
    }
};
</script>

<style scoped>
#payment-element {
    height: 50px;
    padding: 10px;
    border: 1px solid #ccd0d5;
    border-radius: 4px;
    background-color: #f9f9f9;
}
</style>