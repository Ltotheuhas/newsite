<template>
    <v-container>
        <v-row class="mb-6">
            <v-col cols="12">
                <a :href="links.evaBandcamp" target="_blank" class="mx-auto">
                    <v-img :src="require('@/assets/evaChrome.png')" class="rgbeva"></v-img>
                </a>
            </v-col>
            <v-col cols="12">
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
            <v-col cols="12">
                <router-link to="test/eva1">
                    <v-img src="https://f4.bcbits.com/img/a0843754287_10.jpg" class="coolimage"></v-img>
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
        <router-link class="back" to="/test">
            <p>back</p>
        </router-link>
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

.coolimage {
    max-width: 600px;
    margin: 0 auto;
}

.back {
    text-align: center;
}

.back:hover {
    text-decoration: line-through;
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