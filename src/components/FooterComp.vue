<template>
    <v-footer app style="background: none; padding: 0;">
        <v-container fluid style="padding: 10px 15px;">
            <v-row no-gutters>
                <v-col cols="12" sm="6">
                    <a style="all: unset; cursor: pointer;" href="mailto:ltotheuhas@gmail.com" target="_blank">
                        <p>Luhas © Unlicensed Product ☻☺☻ {{ currentYear }}</p>
                    </a>
                </v-col>
                <v-col cols="12" sm="6" class="d-flex justify-end">
                    <div class="counter">
                        <img src='https://www.free-website-hit-counter.com/c.php?d=9&id=161100&s=1'>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </v-footer>
</template>

  
<script>
import { useDisplay } from 'vuetify'

export default {
    data() {
        return {
            currentYear: new Date().getFullYear(),
            currentCursor: 0,
            isSmAndUp: false,
        };
    },
    created() {
        const display = useDisplay();
        this.isSmAndUp = display.smAndUp;
    },
};
</script>
