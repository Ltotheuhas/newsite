<template>
  <v-list class="blog-posts">
    <v-list-item-group>
      <v-list-item class="mb-4" v-for="post in posts" :key="post._id" two-line>
        <v-list-item-content>
          <v-list-item-title v-text="formatDate(post.publishedAt)"></v-list-item-title>
          <p v-html="formatBody(post.body)"></p>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
import { getPosts } from '../sanity'

export default {
  name: 'BlogPosts',
  data() {
    return {
      posts: [],
    }
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');

      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthName = monthNames[date.getMonth()];

      const formattedDate = `${monthName} ${day} ${year}`;
      const time = `${hours}:${minutes}:${seconds}`;

      return `${formattedDate} ${time}`;
    },

    formatBody(body) {
      if (!body) return '';
      return body.replace(/\n/g, '<br>');
    }
  },
  async created() {
    let posts = await getPosts();
    posts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    this.posts = posts;
  },
}
</script>

<style scoped>
ul {
  list-style-type: none;
}

.v-list {
  background-color: transparent !important;
}
</style>