<template>
    <!-- fills whatever rectangle its parent gives it -->
    <div class="ad-frame">
        <!-- 1 : 1 Three-JS scene -->
        <ThreeJSAdScene class="ad-box" />

        <!-- caption -->
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
/* frame: fills parent, stacks scene + text vertically, centres both */
.ad-frame {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* horizontal centre */
    justify-content: center;
    /* vertical centre */
    gap: 1rem;
    overflow: hidden;
}

/* square scene, scales with the shorter edge of .ad-frame */
.ad-box {
    width: 80vmin;
    /* 80 % of min(width, height) */
    aspect-ratio: 1 / 1;
    position: relative;
    /* lets canvas inside use absolute 0/0/0 */
}

/* text styling */
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
