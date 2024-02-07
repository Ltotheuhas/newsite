import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: '1s0at5ry',
  dataset: 'production',
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: '2024-02-07', // use current date (YYYY-MM-DD) to target the latest API version
  // token: process.env.SANITY_SECRET_TOKEN // Only if you want to update content with the client
})

export async function getPosts() {
  const query = `
  *[_type == "post"]{
    _id,
    title,
    "author": author->name,
    "categories": categories[]->title,
    publishedAt,
    mainImage,
    body
  }
`;
  const posts = await client.fetch(query);
  return posts;
}

export async function createPost(post) {
  const result = await client.create(post);
  return result;
}

export async function updateDocumentTitle(_id, title) {
  const result = await client.patch(_id).set({ title });
  return result;
}

const builder = imageUrlBuilder(client);

// Function to generate URL for a given source image
export function urlFor(source) {
  return builder.image(source);
}
