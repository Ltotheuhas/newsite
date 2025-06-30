import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: '1s0at5ry',
  dataset: 'production',
  apiVersion: '2025-06-30',
  useCdn: true
  // token: process.env.SANITY_SECRET_TOKEN
})

const builder = imageUrlBuilder(client)
export const urlFor = source => builder.image(source)

const PRODUCT_FIELDS = `
  _id,
  name,
  price,
  description,
  "slug": slug.current,
  images,
  variantGroups[]{
    name,
    options[]{
      label,
      stock
    }
  },
  quantity
`

export const getProducts = async () =>
  client.fetch(`*[_type == "product"]{${PRODUCT_FIELDS}}`)

export const getProductById = async id =>
  client.fetch(
    `*[_type == "product" && _id == $id][0]{${PRODUCT_FIELDS}}`,
    { id }
  )

export const getPosts = () => client.fetch('*[_type == "post"]')

export const createPost = post => client.create(post)

export const updateDocumentTitle = (_id, title) =>
  client.patch(_id).set({ title })

export const getDailyMessages = () =>
  client.fetch('*[_type == "dailyMessage"]')
