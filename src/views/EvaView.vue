<template>
    <v-container class="showcase">
        <v-row>
            <v-col cols="12" class="eva">
                <a :href="links.evaBandcamp" target="_blank">
                    eva logo w shifting hue here
                </a>
            </v-col>
            <v-col cols="12" class="infobox">
                <h1>Eva Hakai is {{ evaIs }}</h1>
            </v-col>
            <v-col cols="12" class="info">
                Eva Hakai was first established on May 26th 2020 and then set into stone and announced with its original
                member list on June 17th.
            </v-col>
            <v-col cols="12" class="info">
                The team was composed of <a v-for="(artist, index) in artists" :key="index" :href="artist.link"
                    class="artist" target="_blank">{{ artist.name }}</a>.
            </v-col>
            <v-col cols="12" class="info">
                After that point, Eva Hakai has used its platform to produce cassette tapes for three of the members'
                most recent albums.
            </v-col>
            <v-col cols="12" id="tapeFloat">
                <div class="tapes" v-for="(tape, index) in tapes" :key="index">
                    <a :href="tape.link" target="_blank">
                        <v-img :src="tape.image"></v-img>
                    </a>
                </div>
            </v-col>
            <v-col cols="12" class="info">
                On October 9th, Eva Hakai released its first compilation album "<a :href="links.evaVol1" class="artist"
                    target="_blank">Eva Vol. 1</a>", featuring previously unreleased tracks from each of the members.
            </v-col>
            <v-col cols="12" class="eva">
                <a :href="links.evaVol1" target="_blank">
                    <v-img class="selfie" src="https://f4.bcbits.com/img/a0843754287_10.jpg"></v-img>
                </a>
            </v-col>
            <v-col cols="12" class="info">
                On November 18th, Eva Hakai has merged itself into the music label and multimedia art collective <a
                    :href="links.noAgreements" class="artist" target="_blank">No Agreements</a>.
            </v-col>
            <v-col cols="12" class="eva">
                <a :href="links.noAgreements" target="_blank">
                    no agreements dog here but maybe actually not
                </a>
            </v-col>
            <v-col cols="12" class="info">
                Since then most of the members have continued their operations under that label, while a few others have
                split up from the project and continued either independently or under a different group.
            </v-col>
            <v-col cols="12" class="info">
                guy in wiiu here
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
            },
            artists: [
                { name: 'Avenade', link: 'https://avenade.bandcamp.com/' },
                // Add other artists here...
            ],
            tapes: [
                { link: 'https://neupink.bandcamp.com/album/fluorescent-art?label=271419794&tab=merch', image: '@/assets/neuTape.png' },
                // Add other tapes here...
            ]
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
.showcase {
    display: block;
}

.eva .selfie {
    max-width: 100%;
}

.infobox h1 {
    /* Styling for the h1 inside infobox */
}

.artist {
    /* Styling for artist links */
}

/* Add more custom styles here */
</style>