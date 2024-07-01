<template>
    <v-row class="content">
        <v-col cols="12" lg="2" md="4" sm="5">
            <v-card>
                <v-img @click="selectRandomMeImage" cover :src="picOfMe" class="pfp"></v-img>
                <v-card-text class="online">
                    <router-link to="reveal">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                            style="isolation:isolate" viewBox="550.27 1317.664 124 266.636" width="124pt"
                            height="266.636pt">
                            <g>
                                <rect x="550.27" y="1477.664" width="124" height="106.636"
                                    transform="matrix(1,0,0,1,0,0)" fill="var(--dynamic-color)" />
                                <circle vector-effect="non-scaling-stroke" cx="612.2698473648846"
                                    cy="1479.6641707465344" r="62" fill="var(--dynamic-color)" />
                                <circle vector-effect="non-scaling-stroke" cx="612.269847364884" cy="1362.664170746536"
                                    r="45" fill="var(--dynamic-color)" />
                            </g>
                        </svg>
                        ONLINE!
                    </router-link>
                </v-card-text>
                <v-card-text class="py-0">
                    {{ currentMessage }}<br>I make shit
                </v-card-text>
                <v-card-text>
                    Fav song rn:<br>{{ favSong }}
                </v-card-text>
                <v-card-text>
                    <a href="https://www.paypal.com/paypalme/ltotheuhas" target="_blank" class="give-me-your-money">
                        <img :src="require('@/assets/myspace/gifs-de-euro-2.gif')" class="euro" aria-hidden="true"
                            loading="lazy">
                        Give me your money
                        <img :src="require('@/assets/myspace/gifs-de-euro-2.gif')" class="euro pl-1" aria-hidden="true"
                            loading="lazy">
                    </a>
                </v-card-text>
                <v-card-text class="py-0">
                Or send me XMR:<br>
                46SWMim8UZhNkxWE64PNcf47knS6dKG9pjPqb8bpF554EgXAGFdiUZ95ZmGjg6eCTuPH4shU786ms27F2oiBK28NHqjxGXT
                </v-card-text>
                <v-card-text>
                    <pre>
╔╗
║║
║║
╚╝
╔╗
║║╔═╦╦╦═╗
║╚╣║║║║╩╣
╚═╩═╩═╩═╝
╔══╗
║╔╗║
║╚╝╠══╦╦══╦═╗
║╔╗║╔╗║║║║║╩╣
╚╝╚╩╝╚╩╩╩╩╩═╝

☻/ This is bob. Copy and paste
/▌ him so he can take over
/\ luhas.neocities.org</pre>
                </v-card-text>
                <v-img :src="require('@/assets/myspace/cccp.jpg')" class="cccp ml-4 mt-4 rounded-lg"
                    :style="{ filter: `grayscale(80%) invert(1) hue-rotate(${hue + 170}deg)` }"></v-img>
                <v-img :src="require('@/assets/myspace/rat.png')" class="cccp ml-4 mt-4 rounded-lg"
                    :style="{ filter: `grayscale(40%) hue-rotate(${hue + 250}deg)` }"></v-img>
            </v-card>
        </v-col>

        <v-col cols="12" lg="5" md="8" sm="7">
            <v-card>
                <v-card-title class="d-none d-sm-block">Latest Blog Entries [<router-link to="blog">View
                        Blog</router-link>]</v-card-title>
                <v-card-title class="d-sm-none pb-0">Latest Blog Entries</v-card-title>
                <v-card-title class="d-sm-none pt-0">[<router-link to="blog">View
                        Blog</router-link>]</v-card-title>
                <v-card-text>
                    <BlogComp :limit="3"></BlogComp>
                </v-card-text>
            </v-card>

            <v-card>
                <v-card-title>About Me ;D</v-card-title>
                <v-card-text>
                    IM LUHAS IM AN IT/ITS/THEY/HE AND IM {{ calculateAge() }} YEARS OLD AND I MAKE COOL VISUAL AND AUDIO
                    WORKS HAHAA!! X33333 I'm from sarajevo and currently live in vienna! :3 говорим немачки,
                    енглески и српскохрватски OHH!!! ALSO MY FAV VOCALOID IS LEN!!! :3
                </v-card-text>
                <v-img :src="require('@/assets/myspace/len.gif')" class="mx-auto w-25 h-auto"></v-img>
                <v-card-text>
                    This page serves as a general hub for expression for me as well as an archive of everything I've
                    ever been involved in. More info on the latter can be found in my <router-link to="portfolio"
                        style="text-decoration: underline;">portfolio.</router-link>
                </v-card-text>
            </v-card>

            <v-card>
                <v-card-title class="d-none d-sm-block">My Portfolio :3 [<router-link to="portfolio">View
                        Full Portfolio</router-link>]</v-card-title>
                <v-card-title class="d-sm-none pb-0">My Portfolio :3</v-card-title>
                <v-card-title class="d-sm-none pt-0">[<router-link to="portfolio">View
                        Full Portfolio</router-link>]</v-card-title>
                <div class="image-container mx-auto w-75">
                    <transition name="fade" mode="out-in">
                        <v-img v-if="!imageIsLoading" :key="randomPortfolioItemKey"
                            :src="randomPortfolioItem.primary"></v-img>
                    </transition>
                </div>
            </v-card>

            <v-card v-if="windowWidth < 1280" class="d-lg-none mt-4">
                <v-card-title>Comments (o≧∇≦)o</v-card-title>
                <CommentComp></CommentComp>
            </v-card>
        </v-col>

        <v-col v-if="windowWidth >= 1280" class="d-none d-lg-flex" cols="12" lg="5" md="8">
            <v-card style="width: 100%;">
                <v-card-title>Comments (o≧∇≦)o</v-card-title>
                <CommentComp></CommentComp>
            </v-card>
        </v-col>
    </v-row>
    <v-img src="@/assets/myspace/yeet.gif" class="reimu" v-if="windowWidth >= 1280" loading="lazy"></v-img>
</template>

<script>
import BlogComp from '@/components/BlogComp.vue';
import CommentComp from '@/components/CommentComp.vue';
import { portfolioItems } from '@/data/portfolioItems';

export default {
    name: 'MySpace',

    components: {
        CommentComp,
        BlogComp,
    },

    data() {
        return {
            dailyMessages: [
                "I WANT THE ROOF",
                "Just chilling with some music...",
                "The Bees Made Honey in the Lion's Skull",
                "Ѭ̶̍͐ ☈𓁹ᐂϮ𒀱↬𓆉᳇⬳⸸☾ᙷ",
                "Rawr means I love you in dinosaur. XD",
                "Feeling so random today... holds up spork",
                "Why fit in when you were born to stand out? fuck governments",
                "-_-",
                "Дуго живео наш маршал Тито!",
                "https://www.cia.gov/readingroom/docs/CIA-RDP83-00415R006900190006-9.pdf",
                "On Computar",
                "Fuckin",
                "Was",
                "Auf Drogas",
                "Nazis raus aus dem Netz",
                "stupid baka life",
                "Avant Garde Grandpa",
                "AscendinG",
                "lol",
                "...",
                "kek",
                "I found another one",
                "Leonard Cohen speak to me!!!!",
                "You now breathe and blink and puke manually",
                "entered the",
                "OBLIVION TRANSCENDER",
                "Du bist schon iwie komisch...",
                "If I know you personally stop looking at this website",
                "流れてく時の中ででも 気だるさが",
                "I don't make shit",
                "You can click on that pic of me to change the image",
                "Find it",
                "swag",
                "WITTA ROCKET LAUNCHER",
                "Feeding frenzy, it's contagious",
                "PURITY",
                "shamefroze",
                "*reluctantly puts on the cat ears*",
                "$400,000,000",
                "literally discombobulate",
                "You will not last.",
                "???",
                "eeeeehhhhhhhhhhhhhhh",
                "you're literally",
                "so I came into this thread",
                "Urabe Urabe Urabe Urabe Urabe Urabe Urabe Urabe",
                "He defecated through a sunroof",
                "meowdy",
                "cocteau twins be like babadabadaaaaa",
                "Glad you enjoy my presence. :-)",
                "youre literally a miniature fire hydrant",
                "*creates you*",
                "im gonna get you",
                "fell on ya moms big cock i mean i uh um uih i uhg",
                "ham",
                "yes",
                "They Drove In",
                "and?",
                "2021 was the best year of my fucking life",
                "druf free website",
                "Sitting @ my laptop doing thngs....",
                "this thing is annoying",
                "Reply · Flag",
                "MILLIONS NOW LIVING WILL NEVER DIE",
                "ich habe swag hater haben hepatitis b",
                "These pictures are so embarrassing",
                "touhoufan2009",
                "ANTI PSYTRANCE ACTION",
                "пронађи своју срећу и одјеби",
                "Смрт фашизму, слобода народу!",
                "guy debord would HATE this",
                "guy debord would LOVE this",
                "shoutout charli xcx",
                "no space is safe",
                "NEVER FORGET SREBRENICA",
                "I like powerviolence and crust punk"
            ],
            currentMessage: "",
            picOfMe: "",
            windowWidth: window.innerWidth,
            randomPortfolioItem: null,
            randomPortfolioItemKey: Date.now(),
            intervalId: null,
            recentIndices: [],
            imageIsLoading: true,
            favSong: '',
            hue: 0
        };
    },

    mounted() {
        this.loadCommentBoxScript();
        this.chooseDailyMessage();
        this.selectRandomMeImage();
        this.$nextTick(() => {
            window.addEventListener('resize', this.onResize);
        });
        this.applyRandomHue();
        this.fetchTopSong();
        this.intervalId = setInterval(() => {
            this.selectRandomPortfolioItem();
        }, 6000);
    },

    beforeUnmount() {
        window.removeEventListener('resize', this.onResize);
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    },

    created() {
        this.selectRandomPortfolioItem();
    },

    methods: {
        loadCommentBoxScript() {
            if (!window.hcb_user) {
                window.hcb_user = {};
            }
            const s = document.createElement('script');
            const l = window.hcb_user.PAGE || ("" + window.location).replace(/'/g, "%27");
            const h = "https://www.htmlcommentbox.com";

            s.setAttribute("type", "text/javascript");
            s.setAttribute(
                "src",
                h + "/jread?page=" + encodeURIComponent(l).replace("+", "%2B") +
                "&mod=%241%24wq1rdBcg%24jJ44Z9Yty1bqAkTYA64Nz1" +
                "&opts=16798&num=10&ts=" + Date.now()
            );

            if (typeof s != "undefined") {
                document.getElementsByTagName("head")[0].appendChild(s);
            }
        },

        chooseDailyMessage() {
            let seed = new Date().getDate();
            seed = (seed * 9301 + 49297) % 233280;
            const random = seed / 233280;
            const index = Math.floor(random * this.dailyMessages.length);
            this.currentMessage = this.dailyMessages[index];
        },

        calculateAge() {
            const today = new Date();
            const birthDate = new Date('2001-01-24');
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        },

        selectRandomMeImage() {
            const meImageContext = require.context('@/assets/me/', false, /\.jpg$/);
            const meImageFilenames = meImageContext.keys();
            const meImages = meImageFilenames.map(filename => meImageContext(filename));
            const randomIndex = Math.floor(Math.random() * meImages.length);
            this.picOfMe = meImages[randomIndex];
        },

        onResize() {
            this.windowWidth = window.innerWidth;
        },

        selectRandomPortfolioItem() {
            let randomIndex;
            let attempts = 0;

            do {
                randomIndex = Math.floor(Math.random() * portfolioItems.length);
                attempts++;
            } while (this.recentIndices.includes(randomIndex) && attempts < 100);

            if (attempts >= 100) {
                console.error('oops x_x');
                return;
            }

            const newItem = portfolioItems[randomIndex];
            this.imageIsLoading = true;

            const image = new Image();
            image.onload = () => {
                this.randomPortfolioItem = newItem;
                this.randomPortfolioItemKey = Date.now();
                this.imageIsLoading = false;

                clearInterval(this.intervalId);
                this.intervalId = setInterval(() => {
                    this.selectRandomPortfolioItem();
                }, 6000);

                if (this.recentIndices.length >= 3) {
                    this.recentIndices.shift();
                }
                this.recentIndices.push(randomIndex);
            };
            image.src = newItem.primary;
        },

        applyRandomHue() {
            this.hue = Math.floor(Math.random() * 360);
            const color = `hsl(${this.hue}, 30%, 70%)`;

            const titles = document.querySelectorAll('.v-card-title');
            titles.forEach(title => {
                title.style.color = color;
            });

            document.documentElement.style.setProperty('--dynamic-color', color);
            const adjustedHue = (this.hue + 254) % 360;
            document.documentElement.style.setProperty('--dynamic-hue-counter', `${adjustedHue}deg`);
            document.documentElement.style.setProperty('--dynamic-hue-arrow', `${this.hue}deg`);
        },

        async fetchTopSong() {
            const userName = 'Ltotheuhas';
            const apiKey = '5b76a7a11283ba1fbe8d1871b9756514';
            const url = `https://ws.audioscrobbler.com/2.0/?method=user.getTopTracks&user=${userName}&api_key=${apiKey}&format=json&period=7day`;

            try {
                const response = await fetch(url);
                const data = await response.json();
                if (data.toptracks && data.toptracks.track.length > 0) {
                    const topTrack = data.toptracks.track[0];
                    this.favSong = topTrack.artist.name + " - " + topTrack.name;
                    this.favSong = this.favSong.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
                } else {
                    this.favSong = 'idk :3';
                }
            } catch (error) {
                this.favSong = 'idk x_x';
            }
        },
    },
};
</script>

<style scoped>
.content {
    max-width: 1600px;
    margin: auto;
}

.pfp {
    animation: shake 0.1s infinite;
    margin-left: 20px;
    width: 170px;
    height: 170px;
}

.v-row.about {
    margin: 0;
}

.v-card,
.v-list {
    background: none;
    box-shadow: none;
}

.v-card-title {
    font-weight: bold;
}

.v-card-text {
    color: white;
}

.online svg {
    height: 1.5em;
    width: 1em;
    margin-right: 5px;
    animation: blink 1s linear infinite;
}

a {
    color: white;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

.euro {
    height: 1.8em;
}

.give-me-your-money {
    font-family: 'Cabazon', sans-serif;
    font-size: 1.2em;
    text-align: center;
    display: flex;
    align-items: center;
}

.reimu {
    max-width: 400px;
    margin-top: -400px
}

.cccp {
    width: 80%;
}

.image-container {
    height: 340px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active in <2.1.8 */
    {
    opacity: 0;
}

@media only screen and (max-width: 576px) {
    .cccp {
        width: 60%;
    }
}

@keyframes blink {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0;
    }
}

@keyframes shake {
    0% {
        transform: translate(0px, 0px);
    }

    10% {
        transform: translate(-2px, -2px);
    }

    20% {
        transform: translate(-2px, 2px);
    }

    30% {
        transform: translate(2px, -2px);
    }

    40% {
        transform: translate(2px, 2px);
    }

    50% {
        transform: translate(-2px, -2px);
    }

    60% {
        transform: translate(-2px, 2px);
    }

    70% {
        transform: translate(2px, -2px);
    }

    80% {
        transform: translate(2px, 2px);
    }

    90% {
        transform: translate(-2px, -2px);
    }

    100% {
        transform: translate(0px, 0px);
    }
}
</style>

<style>
#HCB_comment_box .hcb-comment-tb button {
    color: var(--dynamic-color) !important;
}

#HCB_comment_box .hcb-icon {
    filter: grayscale(80%) brightness(120%) hue-rotate(var(--dynamic-hue-arrow));
}

.counter img {
    filter: grayscale(80%) brightness(80%) hue-rotate(var(--dynamic-hue-counter));
}
</style>