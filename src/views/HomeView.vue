<template>
    <v-row class="content">
        <v-img :src="require('@/assets/myspace/dejiko.gif')" class="dejiko"
            :style="[oppaDejikoStyle, { filter: `grayscale(40%) hue-rotate(${hue + 321}deg)` }]"
            @click="tweakIt"></v-img>
        <v-col cols="12" lg="2" md="4" sm="5" class="column">
            <v-card>
                <v-img @click="selectRandomMeImage" cover :src="picOfMe" class="pfp"></v-img>
                <v-card-text class="online">
                    <router-link to="reveal">
                        <svg v-if="presenceStatus === 'ONLINE' && lastOnline" xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate"
                            viewBox="550.27 1317.664 124 266.636" width="124pt" height="266.636pt">
                            <g>
                                <rect x="550.27" y="1477.664" width="124" height="106.636"
                                    transform="matrix(1,0,0,1,0,0)" fill="var(--dynamic-color)" />
                                <circle vector-effect="non-scaling-stroke" cx="612.2698473648846"
                                    cy="1479.6641707465344" r="62" fill="var(--dynamic-color)" />
                                <circle vector-effect="non-scaling-stroke" cx="612.269847364884" cy="1362.664170746536"
                                    r="45" fill="var(--dynamic-color)" />
                            </g>
                        </svg>
                        {{ presenceStatus }}!
                    </router-link>
                    <span v-if="presenceStatus === 'OFFLINE' && lastOnline">
                        <br>last seen: {{ timeAgo(lastOnline) }}
                    </span>
                </v-card-text>
                <v-card-text class="py-0">
                    {{ currentMessage }}<br>I make shit
                </v-card-text>
                <!--{{ calculateAge() }}-->
                <v-card-text>
                    Fav song rn:<br>{{ favSong }}
                </v-card-text>
                <v-card-text class="py-0 eurotext">
                    <a href="https://www.paypal.com/paypalme/ltotheuhas" target="_blank" class="give-me-your-money">
                        <img :src="require('@/assets/myspace/gifs-de-euro-2.gif')" class="euro pr-1" aria-hidden="true"
                            loading="lazy">
                        Give me your money
                        <img :src="require('@/assets/myspace/gifs-de-euro-2.gif')" class="euro pl-2" aria-hidden="true"
                            loading="lazy">
                    </a>
                </v-card-text>
                <!--<v-card-text class="py-0">
                    Or send me XMR:<br>
                    87Xeaf2iddZX59zxBLoQ9iZ2tZXbnJu1sBZ5sSUS9tN8goEjEyFLmx4Xp6HNy4aUmx2kdYuWXbvBw4j9pjPgX56L6q59b89
                </v-card-text>-->
                <v-card-text>
                    <pre>
╔╗  ╔╗
║║  ║║╔═╦╦╦═╗
║║  ║╚╣║║║║╩╣
╚╝  ╚═╩═╩═╩═╝
╔══╗
║╔╗║
║╚╝╠══╦╦══╦═╗
║╔╗║╔╗║║║║║╩╣
╚╝╚╩╝╚╩╩╩╩╩═╝

<span style="font-size: 25px; line-height: 0; display: inline;"> </span>☻/ This is bob. Copy and
/▌ <span style="font-size: 25px; line-height: 0; display: inline;"> </span>paste him so he can take
<span style="font-size: 8px; line-height: 0; display: inline;"> </span>/\ <span style="font-size: 17px; line-height: 0; display: inline;"> </span>over {{ formattedUrl }}</pre>
                </v-card-text>
                <!-- <v-img :src="require('@/assets/myspace/cccp.jpg')" class="cccp rounded-lg"
                    :style="{ filter: `grayscale(80%) invert(1) hue-rotate(${hue + 170}deg)` }"></v-img>
                <v-img :src="require('@/assets/myspace/rat.png')" class="cccp mt-4 rounded-lg"
                    :style="{ filter: `grayscale(40%) hue-rotate(${hue + 250}deg)` }"></v-img>-->
            </v-card>
        </v-col>

        <v-col cols="12" lg="5" md="8" sm="7" class="column">
            <v-card>
                <v-card-title class="d-none d-sm-block">Latest Blog Entries [<router-link to="blog">View
                        Blog</router-link>]</v-card-title>
                <v-card-title class="d-sm-none pb-0">Latest Blog Entries</v-card-title>
                <v-card-title class="d-sm-none pt-0">[<router-link to="blog">View
                        Blog</router-link>]</v-card-title>
                <v-card-text class="py-0">
                    <BlogComp :limit="3"></BlogComp>
                </v-card-text>
            </v-card>

            <v-card>
                <v-card-title class="d-none d-sm-block">My Portfolio :3 [<router-link to="portfolio">View
                        Portfolio</router-link>]</v-card-title>
                <v-card-title class="d-sm-none pb-0">My Portfolio :3</v-card-title>
                <v-card-title class="d-sm-none pt-0">[<router-link to="portfolio">View
                        Portfolio</router-link>]</v-card-title>
                <div class="image-container mx-auto">
                    <transition name="fade" mode="out-in" @after-leave="onAfterLeave">
                        <v-img v-if="isVisible" :key="randomPortfolioItemKey"
                            :src="randomPortfolioItem?.primary"></v-img>
                    </transition>
                </div>
            </v-card>
        </v-col>

        <v-col cols="12" lg="5" class="column">
            <v-row class="store-radio-row">
                <v-col cols="12" lg="12" md="6">
                    <v-card>
                        <v-card-title class="d-none d-sm-block">
                            My Products :E [<router-link to="store">Buy</router-link>]
                        </v-card-title>
                        <v-card-title class="d-sm-none pb-0">My Products :E</v-card-title>
                        <v-card-title class="d-sm-none pt-0">
                            [<router-link to="store">Buy</router-link>]
                        </v-card-title>
                        <StoreComp></StoreComp>
                    </v-card>
                </v-col>

                <v-col cols="12" lg="12" md="6">
                    <v-card>
                        <v-card-title class="d-none d-sm-block">
                            LuhasFM d(-_-)b [<router-link to="radio">View Radio</router-link>]
                        </v-card-title>
                        <v-card-title class="d-sm-none pb-0">LuhasFM d(-_-)b</v-card-title>
                        <v-card-title class="d-sm-none pt-0">
                            [<router-link to="radio">View Radio</router-link>]
                        </v-card-title>
                        <RadioComp></RadioComp>
                    </v-card>
                </v-col>
            </v-row>
        </v-col>
    </v-row>

    <v-row class="content">
        <v-col cols="12" class="smallComments column">
            <v-card class="w-100">
                <v-card-title>Comments (o≧∇≦)o</v-card-title>
                <CommentComp></CommentComp>
            </v-card>
        </v-col>
    </v-row>

    <v-row class="p5row">
        <v-col cols="12" class="pa-0">
            <CoolP5Comp />
        </v-col>
    </v-row>

    <v-row class="content">
        <v-col cols="12">
            <BannerComp></BannerComp>
        </v-col>
    </v-row>

    <v-img src="@/assets/myspace/yeet.gif" class="reimu" v-if="shouldShowImage" loading="lazy"></v-img>
</template>

<script>
import BlogComp from '@/components/BlogComp.vue';
import CommentComp from '@/components/CommentComp.vue';
import { portfolioItems } from '@/data/portfolioItems';
import { getDailyMessages } from '../sanity';
import RadioComp from '@/components/RadioComp.vue';
import StoreComp from '@/components/StoreComp.vue';
import BannerComp from '@/components/BannerComp.vue';
import CoolP5Comp from '@/components/CoolP5Comp.vue';

export default {
    name: 'MySpace',

    components: {
        CommentComp,
        BlogComp,
        RadioComp,
        StoreComp,
        BannerComp,
        CoolP5Comp
    },

    data() {
        return {
            dailyMessages: [],
            currentMessage: "",
            picOfMe: "",
            windowWidth: window.innerWidth,
            documentHeight: document.documentElement.scrollHeight,
            randomPortfolioItem: null,
            randomPortfolioItemKey: Date.now(),
            intervalId: null,
            nextItem: null,
            nextItemKey: 0,
            recentIndices: [],
            imageIsLoading: false,
            isVisible: false,
            displayTimeout: null,
            favSong: '',
            hue: 0,
            dejikoTop: 480,
            dejikoLeft: 150,
            movingInterval: null,
            currentUrl: window.location.hostname,
            presenceStatus: 'checking…',
            lastOnline: null,
        };
    },

    computed: {
        shouldShowImage() {
            return this.windowWidth >= 1280 && this.documentHeight >= 1280;
        },

        oppaDejikoStyle() {
            return {
                top: this.dejikoTop + "px",
                left: this.dejikoLeft + "px",
                position: "absolute",
                width: "100px",
                zIndex: 100,
            };
        },

        formattedUrl() {
            return this.currentUrl.replace(/(^\w+:|^)\/\/([^/]+).*/, '$2');
        }
    },

    mounted() {
        this.loadCommentBoxScript();
        this.fetchDailyMessages();
        this.selectRandomMeImage();
        this.$nextTick(() => {
            window.addEventListener('resize', this.onResize);
        });
        window.addEventListener('scroll', this.onScroll);
        this.updateDocumentHeight();
        this.applyRandomHue();
        this.fetchTopSong();
        this.selectRandomPortfolioItem();
        this.fetchPresenceStatus();
        setInterval(this.fetchPresenceStatus, 30000);
    },

    beforeUnmount() {
        window.removeEventListener('resize', this.onResize);
        window.removeEventListener('scroll', this.onScroll);
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        if (this.movingInterval) {
            clearInterval(this.movingInterval);
        }
        clearTimeout(this.displayTimeout);
    },

    methods: {
        loadCommentBoxScript() {
            if (!window.hcb_user) {
                window.hcb_user = {};
            }

            const cleanUrl = window.location.href.split('?')[0];
            const s = document.createElement('script');
            const l = window.hcb_user.PAGE || cleanUrl.replace(/'/g, "%27");
            const h = "https://www.htmlcommentbox.com";

            s.setAttribute("type", "text/javascript");
            s.setAttribute(
                "src",
                `${h}/jread?page=${encodeURIComponent(l).replace("+", "%2B")}&mod=%241%24wq1rdBcg%24jJ44Z9Yty1bqAkTYA64Nz1&opts=16798&num=10&ts=${Date.now()}`
            );

            if (typeof s != "undefined") {
                document.getElementsByTagName("head")[0].appendChild(s);
            }
        },

        async fetchDailyMessages() {
            try {
                const messages = await getDailyMessages();
                this.dailyMessages = messages.map(msg => msg.message);
                this.chooseDailyMessage();
            } catch (error) {
                console.error('Failed to fetch daily messages:', error);
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

        onScroll() {
            this.updateDocumentHeight();
        },

        updateDocumentHeight() {
            this.documentHeight = document.documentElement.scrollHeight;
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
            this.isVisible = false;

            const image = new Image();
            image.onload = () => {
                this.randomPortfolioItem = newItem;
                this.randomPortfolioItemKey = Date.now();
                this.isVisible = true;

                this.displayTimeout = setTimeout(() => {
                    this.isVisible = false;
                }, 6000);

                if (this.recentIndices.length >= 3) {
                    this.recentIndices.shift();
                }
                this.recentIndices.push(randomIndex);
            };
            image.src = newItem.primary;
        },

        onBeforeEnter() {
            // Placeholder for if any specific setup is needed before the new image enters
        },

        onAfterLeave() {
            this.selectRandomPortfolioItem();
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
                    this.favSong = topTrack.artist.name + " - " + topTrack.name.split(" - Remastered")[0].trim();
                    //this.favSong = this.favSong.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
                } else {
                    this.favSong = 'idk :3';
                }
            } catch (error) {
                this.favSong = 'idk x_x';
            }
        },

        tweakIt() {
            if (this.movingInterval) {
                clearInterval(this.movingInterval);
                this.movingInterval = null;
                return;
            }

            this.movingInterval = setInterval(() => {
                const moveX = Math.random() * 40 - 20;
                const moveY = Math.random() * 40 - 20;

                this.dejikoTop = Math.max(0, Math.min(window.innerHeight - 100, this.dejikoTop + moveY));
                this.dejikoLeft = Math.max(0, Math.min(window.innerWidth - 100, this.dejikoLeft + moveX));
            }, 1);
        },

        async fetchPresenceStatus() {
            try {
                const res = await fetch('https://api.luhas.gratis/presence', {
                    cache: 'no-store' // prevent browser from caching old responses
                });
                const data = await res.json();
                this.presenceStatus = data.status;
                this.lastOnline = data.last_online || null;
            } catch (error) {
                console.error('Failed to fetch presence status:', error);
                this.presenceStatus = 'unknown';
            }
        },

        timeAgo(isoString) {
            if (!isoString) return 'unknown';

            const seconds = Math.floor((Date.now() - new Date(isoString)) / 1000);

            const intervals = [
                { label: 'year', seconds: 31536000 },
                { label: 'month', seconds: 2592000 },
                { label: 'day', seconds: 86400 },
                { label: 'hour', seconds: 3600 },
                { label: 'minute', seconds: 60 },
                { label: 'second', seconds: 1 }
            ];

            for (const i of intervals) {
                const count = Math.floor(seconds / i.seconds);
                if (count > 0) return `${count} ${i.label}${count !== 1 ? 's' : ''} ago`;
            }

            return 'just now';
        },
    },
};
</script>

<style scoped>
.content {
    max-width: 2000px;
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
    padding-left: 0;
}

.v-card-text {
    color: white;
    padding: 1rem 0px;
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

.eurotext {
    font-size: 20px;
}

.euro {
    height: 1.6em;
}

.give-me-your-money {
    font-family: 'Cabazon', sans-serif;
    font-size: 1.2em;
    text-align: center;
    display: flex;
    align-items: center;
    width: fit-content;
}

.reimu {
    width: 400px;
    margin-top: -400px;
    position: absolute;
    right: 0;
    transform: scaleX(-1);
}

.cccp {
    width: 80%;
}

.image-container {
    height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    margin-top: 20px;
}

.p5row {
    margin: -100px -20px 0;
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

@media (min-width: 1280px) {

    /* Force the inner row to display in a column direction */
    .store-radio-row {
        flex-direction: column !important;
    }

    /* Make sure each inner v-col takes the full width */
    .store-radio-row>.v-col {
        flex: 0 0 100% !important;
        max-width: 100% !important;
    }
}

@media only screen and (max-width: 600px) {
    .cccp {
        width: 60%;
    }

    .column,
    .comment-box {
        padding: 0;
    }

    .image-container {
        height: 375px;
    }

    .smallComments {
        margin-top: 16px;
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

.hcb-wrapper {
    max-width: 600px;
}
</style>