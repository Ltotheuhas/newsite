<template>
    <div class="random-image-wrapper">
        <div class="image-container" v-for="(imageSource, index) in imageSources" :key="index"
            @mousedown="startDragging($event, index)" @touchstart="startDragging($event, index)"
            @mousemove="onDragging($event, index)" @mouseup="stopDragging" @touchend="stopDragging" :style="{
                top: randomPositions[index] ? randomPositions[index].top + 'px' : '0',
                left: randomPositions[index] ? randomPositions[index].left + 'px' : '0',
                zIndex: randomPositions[index] && randomPositions[index].z ? randomPositions[index].z : 0,
            }">
            <img :src="imageSource" @dragstart.prevent="preventNativeDrag" />
        </div>
    </div>
</template>


<script>
export default {
    props: {
        numImages: Number,
    },
    data() {
        return {
            imageSources: [],
            randomPositions: [],
            dragging: null,
            startCoordinates: { x: 0, y: 0 },
            highestZIndex: 0,
        };
    },
    methods: {
        getRandomImages() {
            for (let i = 0; i < this.numImages; i++) {
                this.randomString(i);
            }
        },
        randomString(index) {
            const chars = '01234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz';
            const stringlength = 5;
            let text = '';
            for (let i = 0; i < stringlength; i++) {
                const rnum = Math.floor(Math.random() * chars.length);
                text += chars.substring(rnum, rnum + 1);
            }

            const source = 'https://i.imgur.com/' + text + '.jpg';

            const image = new Image();
            image.onload = () => {
                if (image.width === 161) {
                    this.randomString(index);
                } else {
                    this.imageSources[index] = source;
                    this.randomPositions[index] = this.generateRandomPosition();
                }
            };
            image.src = source;
        },
        generateRandomPosition() {
            const windowHeight = window.innerHeight;
            const windowWidth = window.innerWidth;
            const maxTop = windowHeight - 200;
            const maxLeft = windowWidth - 200;

            const randomTop = Math.floor(Math.random() * maxTop);
            const randomLeft = Math.floor(Math.random() * maxLeft);

            return { top: randomTop, left: randomLeft };
        },
        startDragging(event, index) {
            const clientX = event.touches ? event.touches[0].clientX : event.clientX;
            const clientY = event.touches ? event.touches[0].clientY : event.clientY;

            this.dragging = index;
            this.startCoordinates.x = clientX;
            this.startCoordinates.y = clientY;
            this.highestZIndex++;
            this.randomPositions[index].z = this.highestZIndex;

            window.addEventListener('touchmove', this.preventPullToRefresh, { passive: false });

            window.addEventListener('touchmove', (e) => this.onDragging(e, index));
            window.addEventListener('touchend', this.stopDragging);
        },
        onDragging(event, index) {
            if (this.dragging === index) {
                const clientX = event.touches ? event.touches[0].clientX : event.clientX;
                const clientY = event.touches ? event.touches[0].clientY : event.clientY;

                const deltaX = clientX - this.startCoordinates.x;
                const deltaY = clientY - this.startCoordinates.y;
                this.randomPositions[index].top += deltaY;
                this.randomPositions[index].left += deltaX;
                this.startCoordinates.x = clientX;
                this.startCoordinates.y = clientY;
            }
        },
        stopDragging() {
            this.dragging = null;

            window.removeEventListener('touchmove', this.preventPullToRefresh);

            window.removeEventListener('touchmove', this.onDragging);
            window.removeEventListener('touchend', this.stopDragging);
        },
        preventNativeDrag(event) {
            event.preventDefault();
        },
        preventPullToRefresh(event) {
            if (this.dragging !== null) {
                event.preventDefault();
            }
        },
    },
    created() {
        this.getRandomImages();
    },
};
</script>

<style scoped>
.random-image-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
}

.image-container {
    position: absolute;
    cursor: grab;
}

img {
    max-height: 500px;
    max-width: 500px;
    object-fit: cover;
}

@media (max-width: 600px) {
    img {
        max-height: 250px;
        max-width: 250px;
    }
}
</style>
