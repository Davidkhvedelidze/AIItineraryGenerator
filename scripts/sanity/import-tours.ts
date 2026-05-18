import {existsSync} from 'node:fs'
import process, {loadEnvFile} from 'node:process'
import {createClient} from 'next-sanity'
import {toursData, type TourImportData} from './tours-data'

for (const envFile of ['.env.local', '.env']) {
  if (existsSync(envFile)) {
    loadEnvFile(envFile)
  }
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fsb01gwc'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-05-05'
const token = process.env.SANITY_API_TOKEN

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
})

function getSlugValue(slug: TourImportData['slug']) {
  return typeof slug === 'string' ? slug : slug.current
}

function toSanityId(slug: string) {
  return `tour-${slug.replace(/[^a-zA-Z0-9._-]/g, '-')}`
}

async function importTours() {
  if (toursData.length === 0) {
    console.log('No tours to import.')
    return
  }

  if (!token) {
    throw new Error('Missing SANITY_API_TOKEN. Set a write token before importing tours.')
  }

  for (const tour of toursData) {
    const slug = getSlugValue(tour.slug)

    if (!slug) {
      throw new Error(`Tour "${tour.title}" is missing a slug.`)
    }

    await client.createOrReplace({
      ...tour,
      _id: toSanityId(slug),
      _type: 'tour',
      slug: {current: slug, _type: 'slug'},
    })

    console.log(`Imported tour: ${tour.title}`)
  }
}

importTours().catch((error) => {
  console.error(error)
  process.exit(1)
})
