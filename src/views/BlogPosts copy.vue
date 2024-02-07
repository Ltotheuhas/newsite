<template>
  <div class="blog-posts">
    <h1>Blog Posts</h1>
    <ul>
      <li v-for="post in posts" :key="post._id">
        <h2>{{ post.title }}</h2>
        <!-- Display published date -->
        <p>Published on: {{ new Date(post.publishedAt).toLocaleString() }}</p>
        <!-- Render post body with PortableText, including custom types -->
        <PortableText :content="post.body" :components="serializers" />
      </li>
    </ul>
  </div>
</template>

<script>
import { h } from 'vue';
import { getPosts, urlFor } from '../sanity'
import { PortableText } from '@portabletext/vue'
import BlogImageComp from '@/components/BlogImageComp.vue'
import BlogVideoComp from '@/components/BlogVideoComp.vue'

export default {
  name: 'BlogPosts',
  components: {
    PortableText
  },
  data() {
    return {
      posts: [],
    }
  },
  computed: {
    serializers() {
      return {
        types: {
          image: ({ node }) => h(BlogImageComp, { node }), 
          video: ({ node }) => h(BlogVideoComp, { node }),
          block: ({ children }) => {
            // Create paragraphs for text blocks
            return h('p', {}, children.join(''));
          }
        }
      };
    }
  },
  methods: {
    urlFor,
  },
  async created() {
    this.posts = await getPosts();
  },
}
</script>

<style>
/* Styles for your blog posts */
.blog-posts img {
  width: 100%;
  max-width: 400px;
  height: auto;
}

/* Add more styles as needed */
</style>