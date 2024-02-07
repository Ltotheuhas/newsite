<template>
  <div class="blog-posts">
    <ul>
      <li v-for="post in posts" :key="post._id">
        <p>{{ formatDate(post.publishedAt) }}</p>
        <p>{{ post.body }}</p>
      </li>
    </ul>
  </div>
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
    }
  },
  async created() {
    this.posts = await getPosts();
  },
}
</script>