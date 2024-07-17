<template>
    <v-row class="portfolio-list-container">
        <v-col cols="12" md="2" class="scrollable-column pt-12" v-show="!isMobile">
            <v-btn v-for="item in sortedPortfolioItems" :key="item.name" @click="selectItem(item.name)">
                {{ item.title ? item.title : item.name }}
            </v-btn>
        </v-col>
        <v-col :class="detailViewClass" cols="12" md="10" ref="detailViewColumn">
            <DetailView v-if="selectedItem" :item="selectedItem" :key="selectedItem.name" :from-list="true"
                ref="detailViewComponent" @toggle-drawer="toggleDrawer" />
        </v-col>
        <v-navigation-drawer v-if="isMobile" v-model="drawer" location="start" temporary>
            <v-list>
                <v-btn v-for="item in sortedPortfolioItems" :key="item.name" @click="selectItem(item.name)">
                    {{ item.title ? item.title : item.name }}
                </v-btn>
            </v-list>
        </v-navigation-drawer>
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
        const drawer = ref(false);
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
                    drawer.value = false;
                }
                nextTick(() => {
                    updateDetailViewClass();
                });
            }
        };

        const toggleDrawer = () => {
            drawer.value = !drawer.value;
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

            // Expand the drawer if no item is selected at the beginning
            if (!selectedItem.value) {
                drawer.value = true;
            }
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
            drawer,
            isMobile,
            detailViewColumn,
            detailViewComponent,
            detailViewClass,
            toggleDrawer,
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

.v-navigation-drawer .v-list {
    display: flex;
    flex-direction: column;
    margin-bottom: 50px;
}

.v-btn, .v-navigation-drawer {
    background-color: rgba(0, 0, 0, 0.5);
    box-shadow: none;
    border-radius: 0;
    width: 100% !important;
}

@media (max-width: 960px) {
    .scrollable-column.md-2 {
        display: none;
    }
}
</style>