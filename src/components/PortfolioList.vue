<template>
    <v-row class="portfolio-list-container">
        <v-col cols="12" md="2" class="scrollable-column pt-12" v-show="!isMobile">
            <v-btn v-for="item in portfolioItems" :key="item.name" @click="selectItem(item.name)">
                {{ item.name }}
            </v-btn>
        </v-col>
        <v-col cols="12" md="10" class="scrollable-column">
            <DetailView v-if="selectedItem" :item="selectedItem" :key="selectedItem.name" :from-list="true" />
        </v-col>
        <v-menu v-if="isMobile" location="end">
            <template v-slot:activator="{ props }">
                <v-btn icon v-bind="props" v-on="on" class="menu-button">
                    <v-icon>mdi-menu</v-icon>
                </v-btn>
            </template>

            <v-list>
                <v-list-item v-for="item in portfolioItems" :key="item.name" @click="selectItem(item.name)">
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
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
        const menu = ref(false);
        const isMobile = ref(window.innerWidth < 960);

        const selectItem = (itemId) => {
            const item = portfolioItems.find(item => item.name === itemId);
            if (item) {
                selectedItem.value = item;
                if (isMobile.value) {
                    menu.value = false;
                }
            }
        };

        const handleResize = () => {
            isMobile.value = window.innerWidth < 960;
        };

        onMounted(() => {
            document.documentElement.style.overflow = 'hidden';
            document.querySelector('.mainStuff').style.paddingTop = '17px';
            window.addEventListener('resize', handleResize);
        });

        onUnmounted(() => {
            document.documentElement.style.overflow = '';
            document.querySelector('.mainStuff').style.paddingTop = '';
            window.removeEventListener('resize', handleResize);
        });

        return {
            portfolioItems,
            selectItem,
            selectedItem,
            menu,
            isMobile,
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

.menu-button {
    position: fixed;
    top: 110px;
    left: 10px;
    z-index: 2000;
}

@media (max-width: 960px) {
    .scrollable-column.md-2 {
        display: none;
    }

    .menu-button {
        display: block;
    }
}
</style>