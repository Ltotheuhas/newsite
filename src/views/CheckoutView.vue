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
                    <v-text-field label="Full Name" v-model="customerName" required></v-text-field>
                    <v-text-field label="Address" v-model="address" required></v-text-field>
                    <v-text-field label="City" v-model="city" required></v-text-field>
                    <v-text-field label="Postal Code" v-model="postalCode" required></v-text-field>

                    <!-- Stripe Card Element -->
                    <div id="card-element"><!-- Stripe Element mounts here --></div>

                    <v-btn color="primary" @click="submitPayment">Confirm Payment</v-btn>
                </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useCartStore } from '../stores/cartStore';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_YourStripePublicKey');

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
        const cardElement = ref(null);
        const clientSecret = ref(null);

        onMounted(async () => {
            stripe.value = await stripePromise;
            elements.value = stripe.value.elements();
            cardElement.value = elements.value.create('card');
            cardElement.value.mount('#card-element');

            // Fetch client secret for Payment Intent from backend
            const response = await fetch('/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: cartItems.value }),
            });
            const data = await response.json();
            clientSecret.value = data.clientSecret;
        });

        const formatCurrency = (value) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(value);
        };

        const submitPayment = async () => {
            if (!clientSecret.value) {
                console.error("Client secret is not available");
                return;
            }

            const { error, paymentIntent } = await stripe.value.confirmCardPayment(clientSecret.value, {
                payment_method: {
                    card: cardElement.value,
                    billing_details: {
                        name: customerName.value,
                        address: {
                            line1: address.value,
                            city: city.value,
                            postal_code: postalCode.value,
                        }
                    }
                }
            });

            if (error) {
                console.error("Payment failed:", error.message);
                alert("Payment failed: " + error.message);
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                console.log("Payment successful");
                alert("Payment successful!");
                cartStore.clearCart();
            }
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
        };
    }
};
</script>

<style scoped>
#card-element {
    padding: 10px;
    border: 1px solid #ccd0d5;
    border-radius: 4px;
    background-color: #f9f9f9;
}
</style>