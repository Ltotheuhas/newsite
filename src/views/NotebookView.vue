<template>
    <div>
        <v-img v-for="(image, index) in notebookImages" :key="index" :src="image" class="page mx-auto my-3"
            :class="{ 'last-page': index === notebookImages.length - 1 }">
        </v-img>
    </div>
</template>

<script>
export default {
    name: 'NotebookView',
    data() {
        return {
            notebookImages: [],
        };
    },
    created() {
        this.loadNotebookImages();
    },
    methods: {
        loadNotebookImages() {
            const context = require.context('@/assets/notebook/', false, /\.png$/);
            this.notebookImages = context.keys()
                .map(file => ({
                    name: file,
                    path: context(file)
                }))
                .sort((a, b) => {
                    const numA = parseInt(a.name.match(/\d+/)[0], 10);
                    const numB = parseInt(b.name.match(/\d+/)[0], 10);
                    return numA - numB;
                })
                .map(file => file.path);
        }

    },
};
</script>

<style scoped>
.page {
    width: 50%;
}

.last-page {
    width: 25%;
}

@media only screen and (max-width: 992px) {
    .page {
        width: 75%;
    }

    .last-page {
        width: 37.5%;
    }
}

@media only screen and (max-width: 576px) {
    .page {
        width: 100%;
    }

    .last-page {
        width: 50%;
    }
}
</style>