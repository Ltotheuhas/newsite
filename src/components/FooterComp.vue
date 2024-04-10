<template>
    <v-footer app style="background: none; padding: 0;">
        <v-container fluid class="py-1 px-2">
            <v-row no-gutters>
                <v-col class="unlicensed" cols="12" sm="6">
                    <a class="email-link" href="mailto:ltotheuhas@gmail.com" target="_blank">
                        <p ref="footerText">Luhas © Unlicensed Product ☻<span class="emoji">☺</span><span
                                class="emoji">☻</span>
                            {{ currentYear }}
                        </p>
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
export default {
    data() {
        return {
            currentYear: new Date().getFullYear(),
            originalText: '',
            scrollTimeout: null,
            zalgoIntensity: 1,
        };
    },
    methods: {
        applyZalgo() {
            this.$refs.footerText.innerHTML = this.zalgofy(this.originalText);
        },
        removeZalgo() {
            this.$refs.footerText.innerHTML = this.originalText;
        },
        handleScroll() {
            this.applyZalgo();
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = setTimeout(() => {
                this.removeZalgo();
            }, 100);
        },
        zalgofy(text) {
            const zalgoChars = {
                up: [
                    '\u030d', '\u030e', '\u0304', '\u0305',
                    '\u033f', '\u0311', '\u0306', '\u0310',
                    '\u0352', '\u0357', '\u0351', '\u0307',
                    '\u0308', '\u030a', '\u0342', '\u0343',
                    '\u0344', '\u034a', '\u034b', '\u034c',
                    '\u0303', '\u0302', '\u030c', '\u0350',
                    '\u0300', '\u0301', '\u030b', '\u030f',
                    '\u0312', '\u0313', '\u0314', '\u033d',
                    '\u0309', '\u0363', '\u0364', '\u0365',
                    '\u0366', '\u0367', '\u0368', '\u0369',
                    '\u036a', '\u036b', '\u036c', '\u036d',
                    '\u036e', '\u036f', '\u033e', '\u035b',
                    '\u0346', '\u031a'
                ],
                middle: [
                    '\u0315', '\u031b', '\u0340', '\u0341',
                    '\u0358', '\u0321', '\u0322', '\u0327',
                    '\u0328', '\u0334', '\u0335', '\u0336',
                    '\u034f', '\u035c', '\u035d', '\u035e',
                    '\u035f', '\u0360', '\u0362', '\u0338',
                    '\u0337', '\u0361', '\u0489'
                ],
                down: [
                    '\u0316', '\u0317', '\u0318', '\u0319',
                    '\u031c', '\u031d', '\u031e', '\u031f',
                    '\u0320', '\u0324', '\u0325', '\u0326',
                    '\u0329', '\u032a', '\u032b', '\u032c',
                    '\u032d', '\u032e', '\u032f', '\u0330',
                    '\u0331', '\u0332', '\u0333', '\u0339',
                    '\u033a', '\u033b', '\u033c', '\u0345',
                    '\u0347', '\u0348', '\u0349', '\u034d',
                    '\u034e', '\u0353', '\u0354', '\u0355',
                    '\u0356', '\u0359', '\u035a', '\u0323'
                ]
            };

            const addZalgo = (char, charsArray) => {
                let result = '';
                for (let i = 0; i < this.zalgoIntensity; i++) {
                    result += charsArray[Math.floor(Math.random() * charsArray.length)];
                }
                return result;
            };

            console.log(this.zalgoIntensity);

            return text.split('').map(char => {
                if (char === " ") return char;
                const zalgoUp = addZalgo(char, zalgoChars.up);
                const zalgoMiddle = addZalgo(char, zalgoChars.middle);
                const zalgoDown = addZalgo(char, zalgoChars.down);
                return char + zalgoUp + zalgoMiddle + zalgoDown;
            }).join('');
        }
    },
    mounted() {
        this.originalText = this.$el.textContent;
        this.zalgoIntensity = Math.floor(Math.random() * 20) + 1;
        window.addEventListener('scroll', this.handleScroll, { passive: true });
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    },
};
</script>

<style scoped>
@media only screen and (max-width: 599px) {
    .unlicensed {
        margin-bottom: -22px;
    }

    .counter img {
        width: 60px;
        height: 20px;
        object-fit: cover;
        object-position: 100% 0;
    }

    .emoji {
        display: none;
    }
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
</style>