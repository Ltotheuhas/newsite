<template>
    <v-row class="portfolio-list-container">
        <v-col cols="12" md="2" class="scrollable-column pt-12" v-show="!isMobile">
            <v-btn v-for="item in sortedPortfolioItems" :key="item.name" @click="selectItem(item.name)">
                {{ item.title ? item.title : item.name }}
            </v-btn>
        </v-col>
        <v-col :class="detailViewClass" cols="12" md="10" ref="detailViewColumn">
            <DetailView v-if="selectedItem" :item="selectedItem" :key="selectedItem.name" :from-list="true"
                ref="detailViewComponent" />
        </v-col>
        <v-menu v-if="isMobile" location="end">
            <template v-slot:activator="{ props }">
                <v-btn icon v-bind="props" v-on="on" class="menu-button">
                    <v-icon>mdi-menu</v-icon>
                </v-btn>
            </template>
            <v-list>
                <v-list-item v-for="item in sortedPortfolioItems" :key="item.name" @click="selectItem(item.name)">
                    <v-list-item-title>{{ item.title ? item.title : item.name }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </v-row>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
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
        const detailViewColumn = ref(null);
        const detailViewComponent = ref(null);
        const detailViewClass = ref('scrollable-column');

        const sortedPortfolioItems = computed(() => {
            return portfolioItems.slice().sort((a, b) => {
                const titleA = a.title ? a.title.toLowerCase() : a.name.toLowerCase();
                const titleB = b.title ? b.title.toLowerCase() : b.name.toLowerCase();
                return titleA.localeCompare(titleB);
            });
        });

        const selectItem = (itemId) => {
            const item = sortedPortfolioItems.value.find(item => item.name === itemId);
            if (item) {
                selectedItem.value = item;
                if (isMobile.value) {
                    menu.value = false;
                }
                nextTick(() => {
                    updateDetailViewClass();
                });
            }
        };

        const handleResize = () => {
            isMobile.value = window.innerWidth < 960;
            nextTick(() => {
                updateDetailViewClass();
            });
        };

        const updateDetailViewClass = () => {
            detailViewComponent.value = detailViewColumn.value?.$el.querySelector('.detail-view');
            const detailViewEl = detailViewComponent.value?.$el || detailViewComponent.value;

            if (detailViewEl && detailViewEl.nodeType === 1) {
                const updateClass = () => {
                    if (detailViewEl.scrollHeight + 130 > window.innerHeight) {
                        detailViewClass.value = 'scrollable-column';
                    } else {
                        detailViewClass.value = 'scrollable-column center-content';
                    }
                };

                nextTick(() => {
                    updateClass();

                    // Check if there are images and set event listeners for them
                    const images = detailViewEl.querySelectorAll('img');
                    if (images.length > 0) {
                        let loadedCount = 0;
                        images.forEach(img => {
                            if (img.complete) {
                                loadedCount++;
                            } else {
                                img.addEventListener('load', () => {
                                    loadedCount++;
                                    if (loadedCount === images.length) {
                                        updateClass();
                                    }
                                });
                            }
                        });

                        // If all images are already loaded
                        if (loadedCount === images.length) {
                            updateClass();
                        }
                    }
                });
            }
        };

        onMounted(() => {
            document.documentElement.style.overflow = 'hidden';
            document.querySelector('.mainStuff').style.paddingTop = '17px';
            window.addEventListener('resize', handleResize);
            detailViewComponent.value = detailViewColumn.value?.$el.querySelector('.detail-view');
            updateDetailViewClass();
        });

        onUnmounted(() => {
            document.documentElement.style.overflow = '';
            document.querySelector('.mainStuff').style.paddingTop = '';
            window.removeEventListener('resize', handleResize);
        });

        watch(selectedItem, () => {
            nextTick(() => {
                detailViewComponent.value = detailViewColumn.value?.$el.querySelector('.detail-view');
                updateDetailViewClass();
            });
        });

        return {
            sortedPortfolioItems,
            selectItem,
            selectedItem,
            menu,
            isMobile,
            detailViewColumn,
            detailViewComponent,
            detailViewClass,
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
    display: flex;
    flex-direction: column;
}

.scrollable-column::-webkit-scrollbar {
    display: none;
}

.center-content {
    justify-content: center;
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