<template>
  <v-list class="blog-posts">
    <v-list-item-group>
      <v-list-item v-for="post in posts" :key="post._id" two-line>
        <v-list-item-content>
          <v-list-item-title v-text="formatDate(post.publishedAt)"></v-list-item-title>
          <v-list-item-title v-text="post.body"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
import { getPosts } from '../sanity'

export default {
  name: 'BlogComp',
  props: {
    limit: {
      type: Number,
      default: null, // No limit by default
    }
  },
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
    }
  },
  async created() {
    let posts = await getPosts();
    posts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    if (this.limit) {
      posts = posts.slice(0, this.limit);
    }
    this.posts = posts;
  },
}
</script>

<style scoped>
.v-list {
  padding: 0;
}

.v-list-item {
  padding-inline-start: 0 !important;
}
</style>