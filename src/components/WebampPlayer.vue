<template>
    <div>
      <div id="winamp-container"></div>
      <button @click="initializeWebamp">Start Webamp</button>
    </div>
  </template>
  
  <script>
  import Webamp from "webamp";
  
  export default {
    name: "WebampPlayer",
    methods: {
      initializeWebamp() {
        if (!Webamp.browserIsSupported()) {
          alert("Webamp is not supported in your browser.");
          return;
        }
  
        const webamp = new Webamp({
          initialTracks: [
            {
              metaData: {
                artist: "Your Radio Station",
                title: "Live Stream",
              },
              url: "http://192.168.0.231:8000/stream.mp3",
            },
          ],
          initialSkin: {
            url: "https://unpkg.com/webamp@latest/skins/green.wsz", // Valid skin URL
          },
        });
  
        webamp
          .renderWhenReady(document.getElementById("winamp-container"))
          .then(() => {
            console.log("Webamp is ready!");
          });
  
        // Handle track change events
        webamp.onTrackDidChange((track) => {
          if (track) {
            console.log("Now playing:", track.metaData.artist, "-", track.metaData.title);
          }
        });
      },
    },
  };
  </script>
  
  <style scoped>
  #winamp-container {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 9999;
  }
  
  button {
    display: block;
    margin: 10px auto;
    padding: 10px 20px;
    font-size: 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>
  