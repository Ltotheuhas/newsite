import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url';
// Import using ESM URL imports in environments that supports it:
// import {createClient} from 'https://esm.sh/@sanity/client'

export const client = createClient({
  projectId: '1s0at5ry',
  dataset: 'production',
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: '2024-02-07', // use current date (YYYY-MM-DD) to target the latest API version
  // token: process.env.SANITY_SECRET_TOKEN // Only if you want to update content with the client
});

const builder = imageUrlBuilder(client);

export function urlFor(source) {
  return builder.image(source);
}

// uses GROQ to query content: https://www.sanity.io/docs/groq
export async function getPosts() {
  const posts = await client.fetch('*[_type == "post"]')
  return posts
}

export async function createPost(post) {
  const result = await client.create(post);
  return result;
}

export async function updateDocumentTitle(_id, title) {
  const result = await client.patch(_id).set({ title });
  return result;
}

export async function getDailyMessages() {
  const messages = await client.fetch('*[_type == "dailyMessage"]');
  return messages;
}

export async function getProducts() {
  const products = await client.fetch(`*[_type == "product"]{
    _id,
    name,
    price,
    description,
    "slug": slug.current,
    images,
    sizesWithStock,
    quantity
  }`);
  return products;
}

export async function getProductById(id) {
  const product = await client.fetch(`*[_id == $id][0]{
    _id,
    name,
    price,
    description,
    "slug": slug.current,
    images,
    sizesWithStock,
    quantity
  }`, { id });
  return product;
}