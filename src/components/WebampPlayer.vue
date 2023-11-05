<template>
    <div ref="webampContainer"></div>
</template>
  
<script>
import { Webamp } from 'webamp';

export default {
    name: 'WebampPlayer',
    mounted() {
        this.initializeWebamp();
    },
    methods: {
        initializeWebamp() {
            const webamp = new Webamp();
            webamp.renderWhenReady(this.$refs.webampContainer);
        },
    },
};
</script>
  