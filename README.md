# TripMate Georgia

AI-powered travel itinerary generator for Georgia.

TripMate Georgia helps tourists create personalized day-by-day travel plans based on their travel dates, airports, preferred overnight cities, interests, budget, and travel style.

## Features

- Personalized AI-generated Georgia itineraries
- Day-by-day trip plan
- Interest-based recommendations
- Food and transport tips
- Responsive UI
- Optimized Next.js App Router architecture
- Type-safe form validation
- Server-side AI API route

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Shadcn UI (lightweight local primitives)
- React Hook Form
- Zod
- OpenAI API or compatible LLM API
- Lucide React

## Installation

```bash
npm install
```

## Environment Variables

Create `.env.local`:

```bash
OPENAI_API_KEY=your_api_key_here
# Optional:
# OPENAI_MODEL=gpt-4o-mini
# OPENAI_TIMEOUT_MS=45000
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-05-05
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
ITINERARY_RATE_LIMIT=10
ITINERARY_RATE_LIMIT_WINDOW_SECONDS=900
SANITY_REVALIDATE_SECRET=your_webhook_secret_here
```

Never expose server keys with `NEXT_PUBLIC_`. `SUPABASE_SERVICE_ROLE_KEY` must stay server-side only.

Use `.env.example` as the deployment variable checklist.

| Variable | Purpose |
| --- | --- |
| `OPENAI_API_KEY` | Server-side OpenAI credential, required for itinerary generation. |
| `OPENAI_MODEL` | Chat completion model (defaults to `gpt-4o-mini`). |
| `OPENAI_TIMEOUT_MS` | Timeout for the OpenAI request before it's treated as a failure and retried once (defaults to `45000`). |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Used to log itinerary requests and to run the durable rate limiter's RPC. Optional — the app degrades gracefully (best-effort logging, in-memory-only rate limiting) if unset. |
| `ITINERARY_RATE_LIMIT` / `ITINERARY_RATE_LIMIT_WINDOW_SECONDS` | Requests allowed per identifier (hashed IP+email) per window. |

## Supabase Setup

Run the SQL files in `supabase/` in the Supabase SQL editor:

- `itinerary_requests.sql` — creates the lead history table. The app writes itinerary requests from the server API route only. Each request is inserted as `pending`, then updated to `success` with the generated itinerary or `error` with a failure message. This logging is best-effort: a Supabase outage never blocks itinerary generation.
- `rate_limits.sql` — creates the `rate_limits` table and the `increment_rate_limit` Postgres function used for atomic, durable rate limiting across serverless instances.

## Vercel Deployment

See `docs/vercel-deployment.md` for the production environment checklist and smoke test steps.

## Development

```bash
npm run dev
```

Open `http://localhost:3000`.

## Project Structure

```txt
src/
  app/
    api/generate-itinerary/route.ts
    layout.tsx
    page.tsx
    globals.css
  components/
    home/
    layout/
    trip-planner/
    ui/
  constants/trip-options.ts
  hooks/useItineraryGenerator.ts
  lib/
    ai/
    validations/
    utils.ts
  types/trip.ts
```

## API Key Security Notes

- AI requests are processed only in `src/app/api/generate-itinerary/route.ts`.
- The OpenAI API key is read from `process.env.OPENAI_API_KEY` on the server.
- Supabase writes use `process.env.SUPABASE_SERVICE_ROLE_KEY` on the server.
- The browser never receives secret keys.

## Future Improvements

- PDF export
- Save itinerary
- User accounts
- Stripe payments
- Email itinerary to user
- Agency dashboard
- Multi-language support
