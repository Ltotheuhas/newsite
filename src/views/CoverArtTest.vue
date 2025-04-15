<template>
    <div class="cover-art-tester">
      <div class="input-group">
        <label>Artist:</label>
        <input v-model="artist" placeholder="Enter artist name" />
      </div>
  
      <div class="input-group">
        <label>Song Title:</label>
        <input v-model="title" placeholder="Enter song title" />
      </div>
  
      <div class="input-group">
        <label>Album (optional):</label>
        <input v-model="album" placeholder="Enter album name" />
      </div>
  
      <button @click="fetchAlbumCover">Fetch Cover</button>
  
      <div class="result">
        <img v-if="coverUrl" :src="coverUrl" alt="Cover Art" />
        <p v-if="coverUrl">✅ Cover URL: <a :href="coverUrl" target="_blank">{{ coverUrl }}</a></p>
        <p v-else-if="error">❌ {{ error }}</p>
      </div>
    </div>
  </template>
  
  <script>
  async function getCoverArt(artist, song, album = "") {
    const musicBrainzBaseURL = "https://musicbrainz.org/ws/2";
    const coverArtBaseURL = "https://coverartarchive.org/release-group/";
  
    try {
      let searchQuery = `recording:${encodeURIComponent(song)} AND artist:${encodeURIComponent(artist)}`;
      if (album) {
        searchQuery += ` AND release:${encodeURIComponent(album)}`;
      }
  
      const searchUrl = `${musicBrainzBaseURL}/recording/?query=${searchQuery}&fmt=json`;
  
      const response = await fetch(searchUrl, {
        headers: {
          "User-Agent": "MyMusicApp/1.0 (your_email@example.com)",
        },
      });
  
      const data = await response.json();
  
      if (!data.recordings || data.recordings.length === 0) {
        return null;
      }
  
      let selectedReleaseGroupId = null;
  
      for (const recording of data.recordings) {
        if (!recording.releases) continue;
  
        for (const release of recording.releases) {
          if (!release["release-group"]) continue;
  
          const releaseGroup = release["release-group"];
          const releaseGroupId = releaseGroup.id;
          const releaseGroupTitle = releaseGroup.title.toLowerCase();
  
          if (album && releaseGroupTitle === album.toLowerCase()) {
            selectedReleaseGroupId = releaseGroupId;
            break;
          }
  
          if (!selectedReleaseGroupId) {
            selectedReleaseGroupId = releaseGroupId;
          }
        }
  
        if (selectedReleaseGroupId) break;
      }
  
      const coverArtUrl = `${coverArtBaseURL}${selectedReleaseGroupId}/front`;
      const coverResponse = await fetch(coverArtUrl, { method: "HEAD" });
  
      if (coverResponse.ok) {
        return coverArtUrl;
      }
  
      return null;
    } catch (error) {
      return null;
    }
  }
  
  export default {
    name: "CoverArtTester",
    data() {
      return {
        artist: "",
        title: "",
        album: "",
        coverUrl: null,
        error: null,
        lastFmApiKey: "5b76a7a11283ba1fbe8d1871b9756514",
      };
    },
    methods: {
      async fetchAlbumCover() {
        this.coverUrl = null;
        this.error = null;
  
        const artist = this.artist.trim();
        const title = this.title.trim();
        const album = this.album.trim();
  
        if (!artist || !title) {
          this.error = "Artist and title are required.";
          return;
        }
  
        try {
          const encodedArtist = encodeURIComponent(artist);
          const encodedTitle = encodeURIComponent(title);
  
          const lastFmUrl = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${this.lastFmApiKey}&artist=${encodedArtist}&track=${encodedTitle}&format=json`;
          const lastFmResp = await fetch(lastFmUrl);
          const lastFmData = await lastFmResp.json();
  
          if (lastFmData?.track?.album?.image?.length) {
            const albumImages = lastFmData.track.album.image;
            const largestImage = albumImages[albumImages.length - 1]["#text"];
            if (largestImage) {
              this.coverUrl = largestImage;
              return;
            }
          }
  
          const musicBrainzCover = await getCoverArt(artist, title, album);
          if (musicBrainzCover) {
            this.coverUrl = musicBrainzCover;
            return;
          }
  
          this.error = "No cover found via Last.fm or MusicBrainz.";
        } catch (err) {
          this.error = "Error fetching cover.";
          console.error(err);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .cover-art-tester {
    background: #1e1e1e;
    color: #fff;
    padding: 20px;
    border-radius: 12px;
    width: 320px;
    margin: 0 auto;
    font-family: Arial, sans-serif;
    text-align: center;
  }
  
  .input-group {
    margin-bottom: 10px;
  }
  
  input {
    padding: 6px;
    width: 90%;
    border-radius: 4px;
    border: none;
  }
  
  button {
    padding: 8px 16px;
    background-color: #444;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #666;
  }
  
  .result {
    margin-top: 15px;
  }
  
  .result img {
    width: 200px;
    height: 200px;
    object-fit: cover;
    margin-bottom: 10px;
    border-radius: 8px;
  }
  </style>
  