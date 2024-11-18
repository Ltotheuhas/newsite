<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="8" class="text-center">

                <v-btn class="mb-5 mr-2" @click="toggleLanguage">
                    {{ currentLanguage === 'en' ? 'German' : 'Englisch' }}
                </v-btn>

                <v-btn class="mb-5 ml-2" @click="toggleYear"> {{ currentYear === 2024 ? '2023' : '2024' }} </v-btn>

                <div class="text-box">
                    <h1 class="hi">hiiiii :3</h1>
                    <p v-if="currentLanguage === 'de'" style="color: red; padding-bottom: 10px;">DER SHIT IST MIT
                        KÜNSTLICHRR
                        INTELLIGENZ MIR ARTIFICIELLER INTELLIGENCE VON ENGLISCH ÜBERSETZT WEIL ICH WILL DAS NICHT ZWEI
                        MAL SCHREIBEN
                        WER ENGLISCH KANN EINFACH AUF ENGLISCH LESEN</p>
                    <p>{{ introText }}</p>
                </div>

                <div v-for="(item, index) in filteredShoutouts" :key="index" class="shoutout-box">
                    <h3 class="name">{{ item.name }}</h3>
                    <template v-if="item.image">
                        <img class="shoutoutpic" :src="item.image">
                    </template>
                    <template v-else>
                        <p>{{ item.text[currentLanguage] }}</p>
                    </template>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { shoutouts2023, shoutouts2024 } from '@/data/shoutoutsData';

export default {
    data() {
        return {
            currentLanguage: 'en',
            currentYear: 2024,
        };
    },
    computed: {
        introText() {
            const data = this.currentYear === 2023 ? shoutouts2023 : shoutouts2024;
            return data.introText[this.currentLanguage];
        },
        filteredShoutouts() {
            const data = this.currentYear === 2023 ? shoutouts2023 : shoutouts2024;
            return data.shoutouts.filter(item => {
                return item.text ? item.text[this.currentLanguage] : item.image;
            });
        }
    },
    methods: {
        toggleLanguage() {
            this.currentLanguage = this.currentLanguage === 'en' ? 'de' : 'en';
        },
        toggleYear() {
            this.currentYear = this.currentYear === 2023 ? 2024 : 2023;
        }
    }
};
</script>

<style>
.v-btn {
    color: black;
}

.text-box,
.shoutout-box {
    margin-bottom: 20px;
    padding: 20px;
}

h1.hi {
    padding-bottom: 30px;
    font-size: 80px;
    font-family: "Comic Sans MS", "Comic Sans", cursive;
}

h3.name {
    font-family: Papyrus, fantasy;
    font-size: 30px;
}

.shoutoutpic {
    width: 80%;
    margin: 10px 0;
}
</style>