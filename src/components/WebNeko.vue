<template>
    <div ref="nekoContainer" class="neko-container">
        <div v-show="isActive" :style="{ top: `${yPosition}px`, left: `${xPosition}px` }" class="neko-layer"
            @dblclick="openNekoHome" @click="handleClick">
            <img :src="currentImage" class="neko-image" />
        </div>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed, getCurrentInstance } from 'vue';

export default {
    name: 'NekoView',
    setup() {
        const { appContext } = getCurrentInstance();
        const images = appContext.config.globalProperties.$images; // Access preloaded images

        const isActive = ref(true);
        const xPosition = ref(0);
        const yPosition = ref(40);
        const mouseX = ref(0);
        const mouseY = ref(0);
        const stepSize = ref(15);
        const delay = ref(250);
        const frameToggle = ref(false);

        const following = ref(false);
        const returningHome = ref(false);
        const atHome = ref(true);
        const direction = ref('');
        const behavior = ref('idle');

        const idleFrameCounter = ref(0);

        const multiFrameIdleAnimations = {
            itching: ['itch1.gif', 'itch2.gif'],
            sleeping: ['sleep1.gif', 'sleep2.gif'],
            scratching: {
                n: ['nscratch1.gif', 'nscratch2.gif'],
                s: ['sscratch1.gif', 'sscratch2.gif'],
                w: ['wscratch1.gif', 'wscratch2.gif'],
                e: ['escratch1.gif', 'escratch2.gif'],
            },
        };

        const currentImage = computed(() => {
            if (behavior.value === 'alert') return images['alert.gif']?.src || '';
            if (behavior.value === 'chasing') {
                return images[`${direction.value}run${frameToggle.value ? 1 : 2}.gif`]?.src || '';
            }

            if (multiFrameIdleAnimations[behavior.value]) {
                const frame = multiFrameIdleAnimations[behavior.value][idleFrameCounter.value];
                return images[frame]?.src || ''; // Safe check to ensure frame exists
            }

            const idleImages = {
                idle: 'still.gif',
                yawning: 'yawn.gif',
            };
            return images[idleImages[behavior.value]]?.src || images['alert.gif']?.src || '';
        });

        const handleClick = () => {
            if (atHome.value && behavior.value === 'idle') {
                behavior.value = 'alert';
                setTimeout(() => {
                    following.value = true;
                    returningHome.value = false;
                    atHome.value = false;
                    behavior.value = 'chasing';
                }, 500);
            } else if (!atHome.value && behavior.value === 'idle') {
                behavior.value = 'alert';
                setTimeout(() => {
                    following.value = false;
                    returningHome.value = true;
                    behavior.value = 'chasing';
                }, 500);
            }
        };

        const setDirectionBasedBehavior = (distX, distY) => {
            const absDistX = Math.abs(distX);
            const absDistY = Math.abs(distY);

            if (absDistX > 0.5 * absDistY && absDistY > 0.5 * absDistX) {
                if (distX > 0 && distY < 0) direction.value = 'ne';
                else if (distX > 0 && distY > 0) direction.value = 'se';
                else if (distX < 0 && distY < 0) direction.value = 'nw';
                else if (distX < 0 && distY > 0) direction.value = 'sw';
            } else if (absDistX > absDistY) {
                direction.value = distX > 0 ? 'e' : 'w';
            } else {
                direction.value = distY > 0 ? 's' : 'n';
            }
        };

        const moveNeko = () => {
            const targetX = following.value ? mouseX.value : returningHome.value ? 0 : xPosition.value;
            const targetY = following.value ? mouseY.value : returningHome.value ? 40 : yPosition.value;

            const distX = targetX - xPosition.value;
            const distY = targetY - yPosition.value;
            const distance = Math.sqrt(distX ** 2 + distY ** 2);

            const fixedStepSize = stepSize.value;

            if (distance > fixedStepSize) {
                xPosition.value += (distX / distance) * fixedStepSize;
                yPosition.value += (distY / distance) * fixedStepSize;

                setDirectionBasedBehavior(distX, distY);
                behavior.value = 'chasing';
                frameToggle.value = !frameToggle.value;
            } else {
                xPosition.value = targetX;
                yPosition.value = targetY;
                behavior.value = 'idle';

                if (following.value) {
                    following.value = false;
                } else if (returningHome.value) {
                    returningHome.value = false;
                    atHome.value = true;
                }
            }
        };

        const think = () => {
            if (isActive.value) {
                moveNeko();
            }
            setTimeout(think, delay.value);
        };

        const handleMouseMove = (event) => {
            mouseX.value = event.pageX;
            mouseY.value = event.pageY;
        };

        const openNekoHome = () => {
            window.open(
                'https://webneko.net',
                '_blank'
            );
        };

        onMounted(() => {
            document.addEventListener('mousemove', handleMouseMove);
            think();
        });

        onUnmounted(() => {
            document.removeEventListener('mousemove', handleMouseMove);
        });

        return {
            currentImage,
            handleClick,
            openNekoHome,
            xPosition,
            yPosition,
            nekoContainer: ref(null),
            isActive,
        };
    },
};
</script>

<style scoped>
.neko-container {
    pointer-events: none;
}

.neko-layer {
    position: fixed;
    top: 0;
    left: 0;
    width: 32px;
    height: 32px;
}

.neko-image {
    cursor: pointer;
    pointer-events: auto;
    image-rendering: pixelated;
}
</style>