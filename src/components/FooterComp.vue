<template>
    <v-footer app style="background: none; padding: 0;">
        <v-container fluid class="py-1 px-2">
            <v-row no-gutters>
                <v-col class="unlicensed" cols="12" sm="6">
                    <p style="width: fit-content">
                        <a class="email-link" href="mailto:ltotheuhas@gmail.com" target="_blank">
                            Luhas © Unlicensed Product ☻<span class="emoji">☺☻</span>
                            {{ currentYear }}
                        </a>
                    </p>
                </v-col>
                <v-col cols="12" sm="6" class="d-flex justify-end">
                    <div class="counter" v-if="loaded">
                        <router-link to="surveillance">
                            <img v-for="(digit, index) in hitDigits" :key="index" :src="getDigitImage(digit)"
                                :alt="digit" class="digit-img" :data-index="index" />
                        </router-link>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </v-footer>
</template>

<script>
export default {
    data() {
        return {
            currentYear: new Date().getFullYear(),
            hitCount: null,
            loaded: false,
        };
    },
    computed: {
        hitDigits() {
            return this.hitCount.toString().padStart(9, '0').split('');
        },
    },
    methods: {
        getDigitImage(digit) {
            return require(`@/assets/numbers/${digit}.png`);
        },
        async fetchHitCount() {
            try {
                const res = await fetch('https://api.luhas.gratis/api/hit');
                const data = await res.json();
                this.hitCount = data.hits.toString();
                this.loaded = true;
            } catch (error) {
                console.error('Failed to fetch hit count:', error);
            }
        },
    },
    mounted() {
        this.fetchHitCount();
    },
};
</script>

<style scoped>
.v-footer {
    mix-blend-mode: exclusion;
}

.email-link {
    all: unset;
    cursor: pointer;
}

.py-1 {
    padding-top: 10px !important;
    padding-bottom: 10px !important;
}

.px-2 {
    padding-left: 15px !important;
    padding-right: 15px !important;
}

.counter {
    display: flex;
    align-items: center;
}

@media only screen and (max-width: 599px) {
    .unlicensed {
        margin-bottom: -22px;
        z-index: 0;
    }

    .emoji {
        display: none;
    }

    .digit-img[data-index^="0"],
    .digit-img[data-index^="1"],
    .digit-img[data-index^="2"],
    .digit-img[data-index^="3"] {
        display: none;
    }
}
</style>
