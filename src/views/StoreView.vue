<template>
    <v-container>
        <v-row>
            <!-- Test Item -->
            <v-col cols="12" md="4">
                <v-card>
                    <v-card-title>Test Item</v-card-title>
                    <v-card-subtitle>€0.00</v-card-subtitle>
                    <v-card-actions>
                        <button class="snipcart-add-item" 
                                data-item-id="test-item" 
                                data-item-name="Test Item"
                                data-item-price="0.00" 
                                data-item-max-quantity="10">
                            Buy Now
                        </button>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
