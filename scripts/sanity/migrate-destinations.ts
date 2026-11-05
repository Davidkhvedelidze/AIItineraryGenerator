/**
 * One-off migration: creates placeholder destination documents and links existing
 * blog posts and tours to them via their `destinations` reference array.
 *
 * Dry run (default):  npm run sanity:migrate-destinations
 * Apply changes:      npm run sanity:migrate-destinations -- --apply
 *
 * Reads SANITY_API_TOKEN (write token), NEXT_PUBLIC_SANITY_PROJECT_ID and
 * NEXT_PUBLIC_SANITY_DATASET from the environment / .env.local. The token is never printed.
 *
 * Idempotent: destinations use fixed _ids (destination-<slug>) with createIfNotExists,
 * and reference arrays are merged (existing refs are kept, missing ones are appended
 * with deterministic _keys), so running it twice changes nothing the second time.
 */
import {existsSync} from 'node:fs'
import process, {loadEnvFile} from 'node:process'
import {createClient} from 'next-sanity'

for (const envFile of ['.env.local', '.env']) {
  if (existsSync(envFile)) {
    loadEnvFile(envFile)
  }
}

const apply = process.argv.includes('--apply')
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fsb01gwc'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-05-05'
const token = process.env.SANITY_API_TOKEN

type DestinationSeed = {
  slug: string
  title: string
  posts: string[]
}

const destinations: DestinationSeed[] = [
  {
    slug: 'tbilisi',
    title: 'Tbilisi',
    posts: [
      'christmas-in-tbilisi-markets-new-year-guide',
      'tbilisi-public-transport-metro-bus-payment-guide',
      'best-museums-in-tbilisi-guide',
      'what-to-buy-in-georgia-souvenirs-tbilisi',
      'tbilisi-airport-to-city-centre-bus-taxi',
      'mother-of-georgia-statue-tbilisi-guide',
      'tbilisi-sulfur-baths-prices-booking-etiquette',
      'cooking-class-in-tbilisi-how-to-choose-book',
      'living-in-tbilisi-digital-nomad-guide',
      'best-day-trips-from-tbilisi-ranked',
      'tbilisi-to-batumi-train-tickets-prices-booking',
    ],
  },
  {
    slug: 'kakheti',
    title: 'Kakheti',
    posts: [
      'rtveli-how-to-experience-georgias-grape-harvest-season',
      'tusheti-travel-guide-georgias-remote-mountain-region',
      'vashlovani-national-park-permits-4x4-guide',
      'lagodekhi-national-park-waterfalls-hikes-guide',
      'kakheti-wine-tour-guide-what-to-see-taste-and-expect',
      'david-gareja-cave-monastery-complete-guide',
    ],
  },
  {
    slug: 'kazbegi',
    title: 'Kazbegi & Gudauri',
    posts: [
      'tbilisi-to-kazbegi-day-trip-is-it-worth-it',
      'gudauri-ski-resort-georgia-complete-guide',
      'kazbegi-in-winter-is-it-worth-the-trip',
    ],
  },
  {
    slug: 'imereti',
    title: 'Imereti & Kutaisi',
    posts: [
      'chiatura-cable-cars-georgia-complete-guide',
      'tskaltubo-abandoned-sanatoriums-complete-guide',
      'prometheus-cave-tickets-boat-visit-guide',
      'kutaisi-travel-guide-canyons-caves-and-georgias-second-city',
      'sataplia-nature-reserve-cave-dinosaur-tracks-guide',
      'kinchkha-waterfall-tickets-kutaisi-guide',
      'kutaisi-airport-to-city-centre-shuttle-taxi',
      'martvili-canyon-tickets-boat-visit-guide',
    ],
  },
  {
    slug: 'samtskhe-javakheti',
    title: 'Samtskhe-Javakheti (Borjomi & Vardzia)',
    posts: [
      'rabati-castle-akhaltsikhe-visitor-guide',
      'bakuriani-ski-resort-family-planning-guide',
      'borjomi-travel-guide-parks-pools-where-to-stay',
      'vardzia-cave-monastery-complete-visitor-guide',
    ],
  },
  {
    slug: 'svaneti',
    title: 'Svaneti',
    posts: ['svaneti-travel-guide-mestia-ushguli-is-it-worth-the-journey'],
  },
  {
    slug: 'adjara',
    title: 'Adjara & Batumi',
    posts: [
      'batumi-guide-is-it-worth-adding-to-your-georgia-itinerary',
      'goderdzi-ski-resort-georgia-guide',
      'tbilisi-to-batumi-train-tickets-prices-booking',
    ],
  },
  {
    slug: 'mtskheta-kartli',
    title: 'Mtskheta & Kartli',
    posts: ['uplistsikhe-cave-city-visitor-guide'],
  },
  {
    slug: 'samegrelo',
    title: 'Samegrelo',
    posts: [
      'zugdidi-travel-guide-palaces-food-one-day-plan',
      'martvili-canyon-tickets-boat-visit-guide',
    ],
  },
]

const tourDestinations: Record<string, string[]> = {
  'tbilisi-city-tour-old-town-narikala-and-panoramic-views': ['tbilisi'],
  'kakheti-full-day-private-tour-sighnaghi-bodbe-and-wine-tasting': ['kakheti'],
  'david-gareja-day-tour-from-tbilisi-cave-monastery-and-rainbow-hills': ['kakheti'],
  'kazbegi-day-tour-from-tbilisi-ananuri-gudauri-and-gergeti-trinity-church': ['kazbegi'],
  '3-day-private-georgia-tour-from-tbilisi-tbilisi-kakheti-kazbegi-and-mtskheta': [
    'kakheti',
    'kazbegi',
    'mtskheta-kartli',
  ],
  'mtskheta-gori-uplistsikhe-full-day-tour-ancient-capitals-and-stalin-museum': ['mtskheta-kartli'],
  'canyons-tour-in-imereti-region': ['imereti', 'samegrelo'],
  '3-day-svaneti-tour-from-tbilisi-mestia-ushguli-and-the-land-of-towers': ['svaneti'],
}

type Reference = {_key: string; _type: 'reference'; _ref: string}

type LinkableDoc = {
  _id: string
  _rev: string
  _type: 'blogPost' | 'tour'
  slug: string
  destinations: Reference[] | null
}

const destinationId = (slug: string) => `destination-${slug}`
const referenceKey = (slug: string) => `dest-${slug}`

function buildPostMapping(): Map<string, string[]> {
  const mapping = new Map<string, string[]>()
  for (const destination of destinations) {
    for (const postSlug of destination.posts) {
      mapping.set(postSlug, [...(mapping.get(postSlug) ?? []), destination.slug])
    }
  }
  return mapping
}

function assertKnownDestinations() {
  const known = new Set(destinations.map((destination) => destination.slug))
  for (const [tourSlug, slugs] of Object.entries(tourDestinations)) {
    for (const slug of slugs) {
      if (!known.has(slug)) throw new Error(`Tour "${tourSlug}" maps to unknown destination "${slug}".`)
    }
  }
}

async function migrate() {
  assertKnownDestinations()

  if (apply && !token) {
    throw new Error('Missing SANITY_API_TOKEN. A write token is required with --apply.')
  }

  const client = createClient({projectId, dataset, apiVersion, token, useCdn: false})
  const postMapping = buildPostMapping()
  const mappings: Record<LinkableDoc['_type'], Map<string, string[]>> = {
    blogPost: postMapping,
    tour: new Map(Object.entries(tourDestinations)),
  }

  console.log(`Project ${projectId} / dataset ${dataset} — ${apply ? 'APPLY' : 'DRY RUN (pass --apply to write)'}`)
  if (!token) console.log('No SANITY_API_TOKEN set: reading published documents only.\n')

  // Includes drafts when a token is present, so pending drafts get the same references
  // and don't drop them on their next publish.
  const docs = await client.fetch<LinkableDoc[]>(
    `*[(_type == "blogPost" && slug.current in $postSlugs) || (_type == "tour" && slug.current in $tourSlugs)]{
      _id, _rev, _type, "slug": slug.current, destinations
    }`,
    {postSlugs: [...postMapping.keys()], tourSlugs: Object.keys(tourDestinations)},
    {perspective: token ? 'raw' : 'published'},
  )
  const existingDestinationIds = new Set(
    await client.fetch<string[]>(`*[_id in $ids]._id`, {
      ids: destinations.map((destination) => destinationId(destination.slug)),
    }),
  )

  const transaction = client.transaction()
  let operations = 0

  console.log('Destinations:')
  destinations.forEach((destination, index) => {
    const _id = destinationId(destination.slug)
    if (existingDestinationIds.has(_id)) {
      console.log(`  = ${_id} already exists, leaving it untouched`)
      return
    }
    console.log(`  + create ${_id} ("${destination.title}", order ${index + 1}, isLive: false)`)
    transaction.createIfNotExists({
      _id,
      _type: 'destination',
      title: destination.title,
      slug: {_type: 'slug', current: destination.slug},
      isLive: false,
      destinationType: 'region',
      order: index + 1,
      excerpt: `Travel guide to ${destination.title}, Georgia. Full guide coming soon.`,
    })
    operations += 1
  })

  const missing: string[] = []

  for (const type of ['blogPost', 'tour'] as const) {
    console.log(`\n${type === 'blogPost' ? 'Blog posts' : 'Tours'}:`)
    for (const [slug, destinationSlugs] of mappings[type]) {
      const matches = docs.filter((doc) => doc._type === type && doc.slug === slug)
      if (matches.length === 0) {
        missing.push(`${type}: ${slug}`)
        console.log(`  ! skip ${slug} (no ${type} with this slug)`)
        continue
      }

      for (const doc of matches) {
        const current = doc.destinations ?? []
        const currentRefs = new Set(current.map((ref) => ref._ref))
        const additions: Reference[] = destinationSlugs
          .filter((destinationSlug) => !currentRefs.has(destinationId(destinationSlug)))
          .map((destinationSlug) => ({
            _key: referenceKey(destinationSlug),
            _type: 'reference',
            _ref: destinationId(destinationSlug),
          }))

        if (additions.length === 0) {
          console.log(`  = ${doc._id} already linked`)
          continue
        }

        console.log(`  ~ ${doc._id} += [${additions.map((ref) => ref._ref).join(', ')}]`)
        transaction.patch(doc._id, (patch) =>
          patch
            .ifRevisionId(doc._rev)
            .setIfMissing({destinations: []})
            .set({destinations: [...current, ...additions]}),
        )
        operations += 1
      }
    }
  }

  console.log(`\n${operations} operation(s) planned.`)
  if (missing.length > 0) {
    console.log(`${missing.length} slug(s) skipped because they do not exist:\n  ${missing.join('\n  ')}`)
  }

  if (!apply) {
    console.log('\nDry run only. Re-run with --apply to write these changes.')
    return
  }

  if (operations === 0) {
    console.log('Nothing to do.')
    return
  }

  const result = await transaction.commit({visibility: 'sync'})
  console.log(`Committed transaction ${result.transactionId}.`)
}

migrate().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
