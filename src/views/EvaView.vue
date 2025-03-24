<template>
    <v-container>
        <v-row class="mb-6 justify-center">
            <v-col cols="12" class="coolimg1">
                <a :href="links.evaBandcamp" class="imglnk" target="_blank">
                    <v-img :src="require('@/assets/evaChrome.png')" class="coolimg1"></v-img>
                </a>
            </v-col>
            <v-col cols="12" class="evais">
                <h1>Eva Hakai is {{ evaIs }}</h1>
            </v-col>
            <v-col cols="12">
                Eva Hakai was first established on May 26th 2020 and then set into stone and announced with its original
                member list on June 17th.
            </v-col>
            <v-col cols="12">
                After that point, Eva Hakai has used its platform to produce cassette tapes for three of the members'
                most recent albums.
            </v-col>
            <v-col cols="12">
                On October 9th, Eva Hakai released its first compilation album "<a :href="links.evaVol1"
                    target="_blank">Eva Vol. 1</a>", featuring previously unreleased tracks from each of the members.
            </v-col>
            <v-col cols="12" class="coolimg2">
                <router-link to="portfolio/eva1" class="imglnk">
                    <v-img class="coolimg2" src="https://f4.bcbits.com/img/a0843754287_10.jpg"></v-img>
                </router-link>
            </v-col>
            <v-col cols="12">
                On November 18th, Eva Hakai has merged itself into the music label and multimedia art collective <a
                    :href="links.noAgreements" target="_blank">No Agreements</a>.
            </v-col>
            <v-col cols="12">
                Since then most of the members have continued their operations under that label, while a few others have
                split up from the project and continued either independently or under a different group.
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'EvaView',
    data() {
        return {
            evaDescriptions: [
                "an internet music label",
                "a creative collective",
                "a physical music distributor",
                "an internet subordinate",
                "a reaction to the current musical zeitgeist",
                "for the online era avant-teens",
                "not dead",
                "a clothing brand",
                "really with them shits",
                "something to represent",
                "not clearly defined",
                "completely undefined actually",
                "a loose mesh of musicians",
                "a ton of work",
                "cooler than your average net label",
                "a part of history",
                "gonna release vol 2 eventually",
                "the work of the one and only Luhaz",
                "genuinely not dead trust me",
                "whatever you want it to be",
                "the best to do it",
                "weeeiiird man",
                "real af no fake shit to be found",
                "flashing right before your eyes",
                "the reason no agreements blew up",
                "there for you"
            ],
            evaIs: "",
            currentDescriptionIndex: 0,
            links: {
                evaBandcamp: 'http://evahakai.bandcamp.com/',
                evaVol1: 'https://evahakai.bandcamp.com/album/eva-vol-1',
                noAgreements: 'https://noagreements.bandcamp.com/'
            }
        }
    },
    mounted() {
        this.startEvaIsRotation();
    },
    methods: {
        startEvaIsRotation() {
            setInterval(() => {
                if (this.currentDescriptionIndex < this.evaDescriptions.length - 1) {
                    this.currentDescriptionIndex++;
                } else {
                    this.currentDescriptionIndex = 0;
                }
                this.evaIs = this.evaDescriptions[this.currentDescriptionIndex];
            }, 40);
        },
    },
    beforeUnmount() {
        clearInterval(this.evaIsRotationInterval);
    },
};
</script>

<style scoped>
a {
    animation: hue-rotation 5s infinite linear;
}

.v-container {
    text-align: center;
}

.coolimg1 {
    max-width: 1200px;
}

.coolimg2 {
    max-width: 600px;
}

.evais {
    text-align: left;
    height: 200px;
}

@keyframes hue-rotation {
    0% {
        filter: hue-rotate(0deg);
    }

    100% {
        filter: hue-rotate(360deg);
    }
}
</style>