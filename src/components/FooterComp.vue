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
                    <div class="counter">
                        <img src='https://www.free-website-hit-counter.com/c.php?d=9&id=161100&s=1'>
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
        };
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

@media only screen and (max-width: 599px) {
    .unlicensed {
        margin-bottom: -22px;
        z-index: 0;
    }

    .counter img {
        width: 78px;
        height: 20px;
        object-fit: cover;
        object-position: 100% 0;
    }

    .emoji {
        display: none;
    }
}
</style>