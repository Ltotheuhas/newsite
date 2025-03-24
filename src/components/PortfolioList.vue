<template>
    <v-row class="portfolio-list-container">
        <v-col cols="12" lg="2" md="3" sm="4" class="scrollable-column px-0 pt-12" v-show="!isMobile">
            <v-btn v-for="item in sortedPortfolioItems" :key="item.name" :ripple="false"
                :class="{ selected: selectedButton === item.name }" @click="selectItem(item.name)">
                {{ item.title ? item.title : item.name }}
            </v-btn>
        </v-col>
        <v-col :class="detailViewClass" cols="12" lg="10" md="9" sm="8" ref="detailViewColumn">
            <DetailView v-if="selectedItem" :item="selectedItem" :key="selectedItem.name" :from-list="true"
                ref="detailViewComponent" @toggle-drawer="toggleDrawer" />
            <div v-if="showShelfIcon" class="year-display" @click="toggleDrawer">Menu</div>
        </v-col>
        <v-navigation-drawer v-if="isMobile" v-model="drawer" location="start" temporary
            :class="{ 'drawer-retracted': !drawer, 'drawer-with-margin': showRadioBar }" :style="{ width: '100vw' }">
            <v-list>
                <v-btn v-for="item in sortedPortfolioItems" :key="item.name" @click="selectItem(item.name)">
                    {{ item.title ? item.title : item.name }}
                </v-btn>
            </v-list>
        </v-navigation-drawer>
    </v-row>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch, nextTick, inject } from 'vue';
import { portfolioItems } from '@/data/portfolioItems';
import DetailView from '../views/DetailView.vue';

export default {
    components: {
        DetailView,
    },
    setup() {
        const selectedItem = ref(null);
        const drawer = ref(false);
        const isMobile = ref(window.innerWidth < 600);
        const detailViewColumn = ref(null);
        const detailViewComponent = ref(null);
        const detailViewClass = ref('scrollable-column');
        const selectedButton = ref(null);
        const isMuted = inject("isMuted");

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

        function debounce(func, delay) {
            let timeout;
            return function (...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), delay);
            };
        }

        const debouncedUpdateDetailViewClass = debounce(updateDetailViewClass, 200);

        const sortedPortfolioItems = computed(() => {
            return portfolioItems.slice().sort((a, b) => {
                const titleA = a.title ? a.title.toLowerCase() : a.name.toLowerCase();
                const titleB = b.title ? b.title.toLowerCase() : b.name.toLowerCase();
                return titleA.localeCompare(titleB);
            });
        });

        const selectItem = (itemId) => {
            selectedItem.value = sortedPortfolioItems.value.find(item => item.name === itemId);
            selectedButton.value = itemId;
            if (isMobile.value) {
                drawer.value = false;
            }
            nextTick(() => {
                debouncedUpdateDetailViewClass();
            });
        };

        const toggleDrawer = () => {
            drawer.value = !drawer.value;
        };

        const handleResize = () => {
            isMobile.value = window.innerWidth < 600;
            nextTick(() => {
                debouncedUpdateDetailViewClass();
            });
        };

        onMounted(() => {
            document.documentElement.style.overflow = 'hidden';
            window.addEventListener('resize', handleResize);
            detailViewComponent.value = detailViewColumn.value?.$el.querySelector('.detail-view');
            debouncedUpdateDetailViewClass();

            if (!selectedItem.value) {
                drawer.value = true;
            }
        });

        onUnmounted(() => {
            document.documentElement.style.overflow = '';
            window.removeEventListener('resize', handleResize);
        });

        watch(selectedItem, (newItem) => {
            if (newItem && newItem.name === 'evaGif') {
                nextTick(() => {
                    debouncedUpdateDetailViewClass();
                });
            }
        });

        const showShelfIcon = computed(() => {
            return isMobile.value && (!selectedItem.value || !selectedItem.value.year) && !drawer.value;
        });

        const showRadioBar = computed(() => !isMuted.value);

        return {
            sortedPortfolioItems,
            selectItem,
            selectedItem,
            selectedButton,
            drawer,
            isMobile,
            detailViewColumn,
            detailViewComponent,
            detailViewClass,
            toggleDrawer,
            showShelfIcon,
            isMuted,
            showRadioBar,
        };
    },
};
</script>

<style scoped>
.portfolio-list-container {
    display: flex;
    height: 100vh;
    margin: -24px;
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

.v-btn,
.v-navigation-drawer {
    background-color: rgba(0, 0, 0, 0.5);
    box-shadow: none;
    border-radius: 0;
}

.v-btn {
    color: white;
    transition: 0.3s;
}

.v-btn:hover,
.v-btn.selected {
    filter: invert(1);
}

.drawer-retracted {
    transform: translateX(-100%) !important;
}


.year-display {
    position: absolute;
    top: 0;
    left: 0;
    margin: 15px;
    letter-spacing: 2rem;
    font-style: italic;
}

.drawer-with-margin {
    margin-top: 12px;
}


@media (max-width: 600px) {
    .scrollable-column.md-2 {
        display: none;
    }
}
</style>