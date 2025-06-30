<template>
    <div class="ad-frame">
        <ThreeJSAdScene class="ad-box" />

        <div class="caption">
            <h1>
                <a href="https://3d.megaworld.xyz" target="_blank" rel="noopener">
                    3d.megaworld.xyz
                </a>
            </h1>
            <p>Virtual bulletin-board world you can walk through<br>
                Built with&nbsp;Vue&nbsp;3, Three.js and MongoDB<br>Property of <a href="https://megaworld.xyz"
                    target="_blank" rel="noopener">megaworld.xyz</a></p>
        </div>
    </div>
</template>

<script setup>
import ThreeJSAdScene from '@/components/ThreeJSAdScene.vue';
</script>

<style scoped>
.ad-frame {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    overflow: hidden;
}

.ad-box {
    width: 80vmin;
    aspect-ratio: 1 / 1;
    position: relative;
}

.caption {
    text-align: center;
    max-width: 80ch;
    line-height: 1.4;
}

.caption a {
    color: #5eed00;
    text-decoration: none;
}

.caption a:hover {
    text-decoration: underline;
}
</style>
