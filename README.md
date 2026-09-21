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

## GA4 tracking and verification

GA4 uses the existing `gtag.js` integration, with `NEXT_PUBLIC_GA_ID` (blank disables loading) and optional `NEXT_PUBLIC_GA_DEBUG=true`. Public environment values are embedded at build time: restart local development or rebuild/redeploy a preview after changing them. No GTM container is required.

**Required data-stream setup:** In GA4 → Admin → Data collection and modification → Data streams → your web stream → Enhanced measurement settings, disable automatic Page views (including “Page changes based on browser history events”). This repository explicitly sends the initial page view and App Router pathname/query navigations, with `send_page_view: false` on configuration. Enabling automatic history tracking alongside this code produces duplicates. Disable outbound-click and form-interaction measurement as well: WhatsApp URLs contain prefilled text and forms contain contact information. Review any other tags configured on this stream to ensure they do not collect those values. These GA4 property settings cannot be changed by repository code. See [Google’s manual page-view guidance](https://developers.google.com/analytics/devguides/collection/ga4/views).

| Event | Exact trigger / parameters |
| --- | --- |
| `itinerary_start` | `useItineraryGenerator`, immediately before POST `/api/generate-itinerary`, after the planner's Zod-validated submit. One event per accepted request; concurrent submissions are ignored. |
| `itinerary_generate_success` | Same hook, after an OK response with `success: true` and a schema-valid itinerary. |
| `itinerary_generate_error` | Same hook, once for non-rate-limit API failure, malformed JSON/itinerary, network failure, or the 60-second client timeout. User cancellation does not emit a failure. |
| `itinerary_rate_limited` | Same hook, HTTP 429 (even with malformed JSON), or response code `RATE_LIMITED`. Does not also send a generation-error event. |
| `whatsapp_click` | Actual clicks on the header (`header`), home CTA (`home_cta`), tours index (`tours_page`), tour booking box (`tour_detail`), shared itinerary floating button (`floating_button`), and inline itinerary result help button (`itinerary_result`). Sends only `click_location`. |
| `tour_click` | Tour card image, title, or View tour link, including middle clicks. Sends `tour_slug` and `click_location: tour_card`. Day-by-day recommended tour cards send `click_location: itinerary_recommendation`. |
| `page_view` | First ready render and each pathname/query navigation; repeated effects and hash-only changes do not send additional page views. |

Generation events contain only `trip_duration`, `travelers_count`, and the fixed-choice `tour_type`; failures also contain a controlled `error_code` and `http_status` (0 for network/timeout). Unknown API codes become `UNKNOWN`. No names, contact details, form text, generated titles, prompts, error messages, or WhatsApp destination URLs are sent in custom events. Page context excludes all query strings/fragments, masks `/itinerary/[id]`, and uses a controlled title. Query-only changes count as navigations but their values are never sent. Existing email/PDF click events are retained without generated titles. Analytics exceptions are swallowed. The existing CSP already allows `www.googletagmanager.com` scripts and HTTPS Google Analytics collection endpoints, including regional endpoints; no CSP changes were necessary.

To verify on local/preview:

1. Use a test GA4 web stream ID for `NEXT_PUBLIC_GA_ID` and set `NEXT_PUBLIC_GA_DEBUG=true` in that environment. Apply the data-stream settings above, then restart `npm run dev` (or rebuild the preview). Do not commit environment secrets.
2. Open GA4 → Admin → Data display → DebugView and select your debug device. Open `http://localhost:3000` with blockers disabled for this test. In browser DevTools Network, filter for `gtag/js` and `collect`; confirm no CSP failures.
3. Confirm one `page_view` for the initial page, then use internal links to `/tours` and `/blog`, and browser Back/Forward. Each navigation should add exactly one. Hash-only planner jumps should add none. Inspect request payloads: `en=page_view`, sanitized `dl`/`dr` and controlled `dt`; no contact data, query strings or private itinerary ID.
4. At `/#trip-planner`, submit an invalid form: no start event. Complete the required fields and submit a valid request: one `itinerary_start`, then one `itinerary_generate_success` on success (with working OpenAI configuration). A saved itinerary navigates to `/itinerary/[id]`; persistence failure uses the inline result. Verify duration, traveler count and tour type parameters, with no form content.
5. Test errors only locally/with mocked responses: block `/api/generate-itinerary` using DevTools request blocking for `NETWORK_ERROR`; override its response with HTTP 500 and `{"success":false,"code":"AI_UNAVAILABLE","message":"Test"}` for an API error. Override with HTTP 429 or HTTP 200 plus `{"success":false,"code":"RATE_LIMITED","message":"Test"}` to confirm only `itinerary_rate_limited`. Do not stress production to trigger limits. `src/hooks/useItineraryGenerator.test.ts` deterministically covers these cases, malformed success payloads, timeout and duplicate submits.
6. Click each WhatsApp placement and each tour-card link. Confirm one named event per click, with the expected location/slug. Verify rendering or hovering emits none. Inspect all event parameters for sensitive data; automatic outbound/form events should be absent.
7. Check Reports → Realtime. Debug traffic can be excluded from standard reports by a developer-traffic filter, so also test with debug disabled if needed. DebugView and browser collection requests are the primary diagnostic checks.
8. Set `NEXT_PUBLIC_GA_DEBUG=false`, restart/rebuild, and verify subsequent events omit `debug_mode`. If these conversions fit your reporting goals, mark `itinerary_generate_success` and `whatsapp_click` as key events in GA4 Admin → Data display → Events/Key events.

DebugView needs the real tag, a reachable collection endpoint and access to the configured GA4 property. Unit tests validate application dispatch, not Google ingestion. See [Google’s DebugView instructions](https://support.google.com/analytics/answer/7201382).
