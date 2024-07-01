<template>
    <v-row class="portfolio-list-container">
        <v-col cols="2" class="scrollable-column pt-12">
            <v-btn v-for="item in portfolioItems" :key="item.name" @click="selectItem(item.name)">
                {{ item.name }}
            </v-btn>
        </v-col>
        <v-col cols="10" class="scrollable-column">
            <DetailView v-if="selectedItem" :item="selectedItem" :key="selectedItem.name" :from-list="false" />
        </v-col>
    </v-row>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { portfolioItems } from '@/data/portfolioItems';
import DetailView from '../views/DetailView.vue';

export default {
    components: {
        DetailView,
    },
    setup() {
        const selectedItem = ref(null);

        const selectItem = (itemId) => {
            const item = portfolioItems.find(item => item.name === itemId);
            if (item) {
                selectedItem.value = item;
            }
        };

        onMounted(() => {
            document.documentElement.style.overflow = 'hidden';
            document.querySelector('.mainStuff').style.paddingTop = '17px';
        });

        onUnmounted(() => {
            document.documentElement.style.overflow = '';
            document.querySelector('.mainStuff').style.paddingTop = '';
        });

        return {
            portfolioItems,
            selectItem,
            selectedItem,
        };
    },
};
</script>

<style scoped>
.portfolio-list-container {
    display: flex;
    height: 100vh;
}

.scrollable-column {
    height: 100%;
    overflow-y: scroll;
    scrollbar-width: none;
    padding-bottom: 120px;
}

.scrollable-column::-webkit-scrollbar {
    display: none;
}
</style>
