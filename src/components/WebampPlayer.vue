<template>
    <div id="webamp"></div>
</template>

<script>
import Webamp from 'webamp';

export default {
    name: 'WebampPlayer',
    mounted() {
        const webamp = new Webamp({
            initialTracks: [
                {
                    metaData: {
                        artist: "DJ Mike Llama",
                        title: "Llama Whippin' Intro"
                    },
                    url: "https://cdn.rawgit.com/captbaritone/webamp/equalizer/demo/llama-2.91.mp3",
                    duration: 5.322286
                }
            ]
        });

        webamp.renderWhenReady(document.getElementById('webamp'));
    },
};
</script>

<style scoped>
#webamp {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 1000;
    pointer-events: auto;
}
</style>