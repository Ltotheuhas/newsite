<template>
    <v-footer app style="background: none; padding: 15px;">
        <a style="all: unset; cursor: pointer;" href="mailto: ltotheuhas@gmail.com" target="_blank">
            <p>Luhas © Unlicensed Product ☻☺☻ {{ currentYear }}</p>
        </a>
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
