<template>
    <img v-if="src" :src="src" alt="Erdstall" class="erdstall-image" @error="onImgError">
    <div v-else class="erdstall-placeholder"></div>
</template>

<script>
export default {
    name: 'ErdStall',
    data() {
        return {
            src: null,
            imgBaseUrl: 'https://erdstall.luh.as/pics/',
            count: 6, // we know there are 1.jpg ... 6.jpg
        };
    },
    mounted() {
        // pick a random number between 1 and this.count
        const n = Math.floor(Math.random() * this.count) + 1;
        this.src = this.imgBaseUrl + n + '.jpg';
    },
    methods: {
        onImgError() {
            console.error('[ErdStall] image failed to load:', this.src);
            this.src = null;
        },
    },
};
</script>

<style scoped>
.erdstall-image {
    width: 100%;
    height: auto;
    display: block;
    user-select: none;
}

.erdstall-placeholder {
    width: 100%;
    height: 200px;
}
</style>
