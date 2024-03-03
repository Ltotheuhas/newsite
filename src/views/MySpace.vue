<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="4">
                <v-card>
                    <v-img :src="require('@/assets/myspace/square.png')" class="spinning-image"></v-img>
                    <v-card-title>Luhas>_&lt;</v-card-title>
                    <v-card-text>
                        "{{ currentMessage }}"<br>I eat poopy babies
                    </v-card-text>
                    <v-card-text class="online"><img src="https://static.spacehey.net/img/green_person.svg"
                            aria-hidden="true" alt="Online icon" loading="lazy"> ONLINE!</v-card-text>
                </v-card>

                <v-card>
                    <v-card-title>Mood: :3</v-card-title>
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

☻/ This is bob. Copy and
/▌ paste him so he can
/\ take over luhas.neocities.org.
      </pre>
                    </v-card-text>
                    <v-card-text>
                        View my: <router-link to="blog">Blog</router-link> | <router-link
                            to="test">Portfolio</router-link>
                    </v-card-text>
                </v-card>

                <v-card>
                    <v-card-title>My Interests x3</v-card-title>
                    <v-row class="about">
                        <v-col cols="4">
                            General
                        </v-col>
                        <v-col cols="8">
                            I like things that sound cool and things that look cool, I
                            also like redbull and salt n vinegar chips :D OH ALSO I LOVE HORROR GAMES (especially cry of
                            fear) and I have 274 Synthesisers :D
                            <v-img :src="require('@/assets/myspace/skvll.gif')" class="h-auto my-4"></v-img>
                        </v-col>
                    </v-row>
                    <v-row class="about">
                        <v-col cols="4">
                            Music
                        </v-col>
                        <v-col cols="8">
                            I listen to Laurel Halo, Ayesha Erotica, Full of Hell, Tom Tom Club, Felix da Housecat,
                            LUCY,
                            Sonic Youth, SpaceGhostPurrp, Elliott Smith, Yung Lean, The Microphones, Coil, Faust, Three
                            6 Mafia,
                            Goreshit, Deftones, Jim O'Rourke, Connie Converse, Kleenex Girl Wonder, Schwefelgelb,
                            Sd Laika, Venetian Snares, Grauzone, Psychic TV, Leonard Cohen, The Mars Volta, Speaker
                            Knockerz, Tek Lintowe, Unwound, Death Insurance, Sonny & The Sunsets, Blackhandpath, And
                            much more but I kinda
                            forgot XP
                            <v-img :src="require('@/assets/myspace/musicislife.gif')" class="h-auto my-4"></v-img>
                        </v-col>
                    </v-row>
                    <v-row class="about">
                        <v-col cols="4">
                            Movies
                        </v-col>
                        <v-col cols="8">
                            I really like David Lynch movies and alot of surrealist films but my favorite movie has to
                            be spirited away
                            <v-img :src="require('@/assets/myspace/horror.gif')" class="h-auto my-4"></v-img>
                        </v-col>
                    </v-row>
                    <v-row class="about">
                        <v-col cols="4">
                            Books
                        </v-col>
                        <v-col cols="8">
                            Junji ito books (i have alot), Drifting classroom, Berzerk, Revolutionary Demonology,
                            Goodnight Pun
                            Pun, The Archetypes and the Collective Unconscious, The Society of the Spectacle,
                            Homunoculus, A Methodology of Possession, ALOT OF MANGA BASICALLY
                            <v-img :src="require('@/assets/myspace/cccp.jpg')" class="h-auto my-4"></v-img>
                        </v-col>
                    </v-row>
                    <v-row class="about">
                        <v-col cols="4">
                            Heroes
                        </v-col>
                        <v-col cols="8">
                            myself X3
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>

            <v-col cols="12" md="8">
                <v-card>
                    <v-card-title>Luhas' Latest Blog Entries [<router-link to="blog">View
                            Blog</router-link>]</v-card-title>
                    <v-card-text>
                        <BlogComp :limit="3"></BlogComp>
                    </v-card-text>
                </v-card>

                <v-card>
                    <v-card-title>About Me ;D</v-card-title>
                    <v-card-text>
                        I LOOOOOOOOOOOVE TACOSSSS! IM A GIRLLLL AND IM {{ calculateAge() }} AND I HAVE ADHD XDD!! OHH!
                        AND I ALSO PLAY
                        GUITAR!! X33333 And I loooooove to go rollerskating! :3 I ALSO HAVE 2 BUNNIES (s'more, & fizzy),
                        2 GUINEA PIGS (sebastian, & barry), AND A DOG NAMED BRONCO! AND MY FAV VOCALOID IS LEN!!! :3
                    </v-card-text>
                    <v-img :src="require('@/assets/myspace/len.gif')" class="mx-auto w-25 h-auto"></v-img>
                    <v-card-title>Who I'd like to meet:</v-card-title>
                    <v-card-text>
                        hmmm probablyyy the pig destroyer band cuz they seem really cool and i like their music :3
                    </v-card-text>
                </v-card>

                <v-card>
                    <v-card-title>My Artwork :3 [<router-link to="test">View
                            Full Portfolio</router-link>]</v-card-title>
                    <v-card-text>
                        tbd
                    </v-card-text>
                </v-card>

                <v-card>
                    <v-card-title>Comments (o≧∇≦)o</v-card-title>
                    <CommentComp></CommentComp>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import BlogComp from '@/components/BlogComp.vue';
import CommentComp from '@/components/CommentComp.vue';

export default {
    name: 'MySpace',

    components: {
        CommentComp,
        BlogComp,
    },

    data() {
        return {
            dailyMessages: [
                "Off from school 2day :3",
                "Just chilling with some music...",
                "Homework overload ><",
                "TGIF! Ready for the weekend!",
                "Mood: 🎮",
                "Listening to My Chemical Romance and feeling the feels. </3",
                "Rawr means I love you in dinosaur. XD",
                "Is it just me or does Panic! At The Disco understand life?",
                "Feeling so random today... holds up spork",
                "Can't wait for Warped Tour this summer. Who's going?",
                "Currently: Wishing I was at a Fall Out Boy concert.",
                "Studded belts and skinny jeans are life.",
                "Dreaming of Hot Topic shopping sprees.",
                "Life's not a garden, so stop being a hoe.",
                "Glitter, neon, and dreams of being on MTV.",
                "Mood: Invisible by Ashlee Simpson",
                "Why fit in when you were born to stand out? scene queen",
                "Friend requests are cool, but have you ever had someone dedicate a Dashboard Confessional song to you?",
                "Wishing life was as simple as adding a cool new MySpace layout.",
                "Looking for my Edward Cullen in a world full of Jacob Blacks.",
                "Convincing my mom to let me dye my hair pink. Wish me luck!",
                "Lost in a sea of LiveJournal entries and MSN messenger chats.",
                "Current obsession: Making the perfect MySpace playlist.",
                "If I could just meet Gerard Way, my life would be complete.",
                "Drowning in homework, but there's always time for Neopets.",
            ],
            currentMessage: "",
        };
    },

    mounted() {
        this.loadCommentBoxScript();
        this.chooseDailyMessage();
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
            const index = dayOfYear % this.dailyMessages.length; // Use modulo to cycle through the array
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
        }
    },
};
</script>

<style scoped>
@keyframes speen {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(-360deg);
    }
}

.spinning-image {
    animation: speen 6s linear infinite;
    margin: 40px auto;
    width: 50%;
}

.v-container {
    max-width: 1000px;
}

.v-row.about {
    margin: 0;
}

.v-card {
    border: double #FF6BBF 4px;
    margin-bottom: 24px;
}

.v-img {
    height: 200px;
    position: relative;
    overflow: hidden;
    border-radius: 4px;
}

.v-card-title {
    font-weight: bold;
    color: #FF6BBF;
}

.v-card-text {
    color: white;
}

.v-img img {
    object-fit: cover;
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
</style>