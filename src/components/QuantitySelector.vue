<template>
    <v-col :cols="cols" class="d-flex justify-center align-center inherit">
        <div class="quantity-selector-box">
            <v-btn icon variant="plain" @click="decreaseQuantity" :disabled="isDecreaseDisabled"
                class="quantity-btn no-background" :ripple="false">
                <v-icon>mdi-minus</v-icon>
            </v-btn>
            <span class="quantity-value">{{ value }}</span>
            <v-btn icon variant="plain" @click="increaseQuantity" :disabled="isIncreaseDisabled"
                class="quantity-btn no-background" :ripple="false">
                <v-icon>mdi-plus</v-icon>
            </v-btn>
        </div>
    </v-col>
</template>

<script>
export default {
    name: 'QuantitySelector',
    props: {
        value: {
            type: Number,
            required: true,
        },
        maxQuantity: {
            type: Number,
            required: true,
        },
        cols: {
            type: Number,
            default: 12,
        },
    },
    emits: ['update:value'],
    computed: {
        isDecreaseDisabled() {
            return this.value <= 1;
        },
        isIncreaseDisabled() {
            return this.value >= this.maxQuantity;
        },
    },
    methods: {
        increaseQuantity() {
            if (!this.isIncreaseDisabled) {
                this.$emit('update:value', this.value + 1);
            }
        },
        decreaseQuantity() {
            if (!this.isDecreaseDisabled) {
                this.$emit('update:value', this.value - 1);
            }
        },
    },
};
</script>

<style scoped>
.quantity-selector-box {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #BDBDBD;
    border-radius: 4px;
    padding: 4px 8px;
    width: 120px;
    height: 50px;
}

.quantity-value {
    text-align: center;
    font-weight: 500;
    font-size: 16px;
    width: 24px;
    margin: 0 8px;
}

.quantity-btn {
    min-width: 24px;
    height: 24px;
    color: white;
}

.no-background {
    background-color: transparent !important;
    box-shadow: none !important;
    border: none !important;
}

.v-btn[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
}

.inherit {
    flex: inherit;
    flex-basis: content;
}
</style>