<template>
    <v-row>
        <v-col cols="12" lg="2" md="4">
            <v-card>
                <v-img cover :src="picOfMe" class="pfp"></v-img>
                <v-card-text>
                    {{ currentMessage }}<br>I make shit
                </v-card-text>
                <v-card-text class="py-0">
                    <a href="https://www.paypal.com/paypalme/ltotheuhas" target="_blank" class="give-me-your-money">
                        <img :src="require('@/assets/myspace/gifs-de-euro-2.gif')" class="euro" aria-hidden="true"
                            loading="lazy">
                        Give me your money
                        <img :src="require('@/assets/myspace/gifs-de-euro-2.gif')" class="euro pl-1" aria-hidden="true"
                            loading="lazy">
                    </a>
                </v-card-text>
                <router-link to="reveal">
                    <v-card-text class="online">
                        <img :src="require('@/assets/myspace/green_person.svg')" aria-hidden="true" alt="Online icon"
                            loading="lazy"> ONLINE!</v-card-text>
                </router-link>
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
/\ luhas.neocities.org.</pre>
                </v-card-text>
            </v-card>
        </v-col>

        <v-col cols="12" md="8" lg="5">
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
                    WORKS HAHAA!! X33333 I'm from former yugoslavia and currently live in vienna! :3 говорим немачки,
                    енглески и српскохрватски OHH!!! ALSO MY FAV VOCALOID IS LEN!!! :3
                </v-card-text>
                <v-img :src="require('@/assets/myspace/len.gif')" class="mx-auto w-25 h-auto"></v-img>
                <v-card-text>
                    This page serves as a general hub for expression for me as well as an archive of everything I've
                    ever been involved in. More info on the latter can be found in my <router-link to="test"
                        style="text-decoration: underline;">portfolio.</router-link>
                </v-card-text>
            </v-card>

            <v-card>
                <v-card-title class="d-none d-sm-block">My Portfolio :3 [<router-link to="test">View
                        Full Portfolio</router-link>]</v-card-title>
                <v-card-title class="d-sm-none pb-0">My Portfolio :3</v-card-title>
                <v-card-title class="d-sm-none pt-0">[<router-link to="test">View
                        Full Portfolio</router-link>]</v-card-title>
                <router-link :to="`/test/${randomPortfolioItem.name}`">
                    <v-img :src="randomPortfolioItem.primary" class="mx-auto w-50 h-auto"></v-img>
                </router-link>
            </v-card>

            <v-card v-if="windowWidth < 1200" class="d-lg-none">
                <v-card-title>Comments (o≧∇≦)o</v-card-title>
                <CommentComp></CommentComp>
            </v-card>
        </v-col>

        <v-col v-if="windowWidth >= 1200" class="d-none d-lg-flex" cols="12" md="8" lg="5">
            <v-card style="width: 100%;">
                <v-card-title>Comments (o≧∇≦)o</v-card-title>
                <CommentComp></CommentComp>
            </v-card>
        </v-col>
    </v-row>
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
            ],
            currentMessage: "",
            picOfMe: "",
            windowWidth: window.innerWidth,
            randomPortfolioItem: null,
        };
    },

    mounted() {
        this.loadCommentBoxScript();
        this.chooseDailyMessage();
        this.selectRandomMeImage();
        this.$nextTick(() => {
            window.addEventListener('resize', this.onResize);
        });
    },

    beforeUnmount() {
        window.removeEventListener('resize', this.onResize);
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
            const today = new Date();
            const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
            const index = dayOfYear % this.dailyMessages.length;
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
            const randomIndex = Math.floor(Math.random() * portfolioItems.length);
            this.randomPortfolioItem = portfolioItems[randomIndex];
        },
    },
};
</script>

<style scoped>
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
    color: #FF6BBF;
}

.v-card-text {
    color: white;
}

.online img {
    height: 1.5em;
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
    display: flex;
    align-items: center;
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