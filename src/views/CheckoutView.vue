<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="8" offset-md="2">
                <div v-if="cartItems.length > 0">
                    <h2>Order Summary</h2>
                    <v-list class="listo">
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
                    <div id="address-element" class="address-container stripe"></div>
                    <div id="payment-element" class="payment-container stripe"></div>
                    <v-alert v-if="errorMessage" type="error" dismissible>
                        {{ errorMessage }}
                    </v-alert>
                    <v-row class="buttonz">
                        <v-col cols="12" sm="6" class="d-flex justify-start buttoncol">
                            <v-btn outlined large class="buttn back-to-cart-btn" @click="backToCart">
                                Back 2 Cart
                            </v-btn>
                        </v-col>
                        <v-col cols="12" sm="6" class="d-flex justify-end buttoncol">
                            <v-btn :loading="loading" color="primary" large class=" buttn payment-btn"
                                @click="submitPayment" :style="{ filter: `hue-rotate(${cartTotal}deg)` }">
                                Confirm Payment
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>
                <div class="info-text">
                    <p>
                        This sale is securely processed through Stripe. Your payment and personal information are
                        encrypted and protected.
                    </p>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cartStore';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY);

export default {
    name: 'CheckoutView',
    setup() {
        const router = useRouter();
        const cartStore = useCartStore();
        const cartItems = computed(() => cartStore.items);
        const cartTotal = computed(() => cartStore.cartTotal);

        const customerName = ref('');
        const stripe = ref(null);
        const elements = ref(null);
        const loading = ref(false);
        const clientSecret = ref(null);
        const errorMessage = ref(null);

        const formatCartItems = () => {
            return cartItems.value.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                ...(item.size && { size: item.size, sizeKey: item.sizeKey })
            }));
        };

        onMounted(async () => {
            try {
                stripe.value = await stripePromise;

                const itemsPayload = formatCartItems();

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
                        fontFamily: 'Play, sans-serif',
                        fontLineHeight: '1.5',
                        borderRadius: '0',
                        colorBackground: 'transparent',
                        colorText: '#6c6d78',
                        colorLabelText: '#ffffff',
                    },
                    rules: {
                        '.Input, .CheckboxInput, .CodeInput': {
                            transition: 'none',
                            boxShadow: 'inset -1px -1px #ffffff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px #808080',
                            color: 'var(--colorText)',
                        },
                        '.Label': {
                            color: 'var(--colorLabelText)',
                        },
                        '.Input': {
                            padding: '12px',
                        },
                        '.Input--invalid': {
                            color: '#DF1B41',
                        },
                        '.Tab, .Block, .PickerItem--selected': {
                            backgroundColor: '#dfdfdf',
                            boxShadow: 'inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf',
                        },
                        '.Tab:hover': {
                            backgroundColor: '#eee',
                        },
                        '.Tab--selected': {
                            color: 'var(--colorText)',
                            backgroundColor: '#ccc',
                        },
                    },
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

            try {
                const orderDetails = {
                    items: formatCartItems(),
                    total: cartTotal.value,
                };

                sessionStorage.setItem('orderDetails', JSON.stringify(orderDetails));

                const { error } = await stripe.value.confirmPayment({
                    elements: elements.value,
                    confirmParams: {
                        return_url: `${window.location.origin}/store/confirmation`,
                        payment_method_data: {
                            billing_details: {
                                name: customerName.value,
                            },
                        },
                    },
                });

                if (error) {
                    throw new Error(error.message);
                }

                cartStore.clearCart();
            } catch (error) {
                errorMessage.value = error.message;
            } finally {
                loading.value = false;
            }
        };

        const backToCart = () => {
            router.push({ path: '/store/cart' });
        };

        return {
            cartItems,
            cartTotal,
            customerName,
            formatCurrency,
            submitPayment,
            loading,
            errorMessage,
            backToCart
        };
    }
};
</script>

<style scoped>
.stripe {
    filter: hue-rotate(71deg) saturate(494%) contrast(297%) invert(92%) drop-shadow(0px 0px 6px #000000);
    -webkit-filter: hue-rotate(71deg) saturate(494%) contrast(297%) invert(92%) drop-shadow(0px 0px 6px #000000);
    -moz-filter: hue-rotate(71deg) saturate(494%) contrast(297%) invert(92%) drop-shadow(0px 0px 6px #000000);
}

.payment-container,
.address-container {
    margin-top: 16px;
}

#payment-element *:focus,
#address-element *:focus {
    outline: none;
}

.buttn {
    text-transform: none;
    border-radius: 4px;
    height: 50px;
}

.back-to-cart-btn {
    filter: invert(1);
}

::v-deep(.buttn .v-btn__content) {
    font-size: 1.6em;
}

::v-deep(.payment-btn .v-btn__content) {
    font-family: 'Cabazon', sans-serif;
}

::v-deep(.back-to-cart-btn .v-btn__content) {
    color: white;
    mix-blend-mode: difference;
}

.listo {
    background: none;
}

.info-text {
    margin-top: 24px;
    text-align: center;
    opacity: 0.15;
    font-size: 0.6em;
}

@media (max-width: 600px) {
    .prodCard {
        padding-top: 0 !important;
    }

    .buttonz {
        margin-top: 20px;
    }

    .buttn {
        width: 100%;
    }

    .buttoncol {
        padding: 8px 0;
    }
}
</style>