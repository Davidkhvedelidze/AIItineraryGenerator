# Vercel Deployment Checklist

## Required Environment Variables

Add these in Vercel Project Settings before deploying. Local files such as `.env`, `.env.local`, and `.env.production` are not used by Vercel production unless the same values are added to the Vercel project environment variables.

- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_GA_ID` if Google Analytics is used
- `ITINERARY_RATE_LIMIT` if the default 10 requests per email/IP window should change
- `ITINERARY_RATE_LIMIT_WINDOW_SECONDS` if the default 900-second window should change

Do not expose `SUPABASE_SERVICE_ROLE_KEY` with a `NEXT_PUBLIC_` prefix.
Do not commit real secrets. Keep real values in local ignored env files and in Vercel Environment Variables only.

After adding or changing any Vercel environment variable, redeploy production so the runtime receives the new values:

```bash
vercel --prod
```

Confirm Vercel has the expected variables:

```bash
vercel env ls
```

Confirm the production alias points to the expected deployment:

```bash
vercel inspect https://tripmate-georgia.vercel.app
```

## Supabase Setup

Run `supabase/itinerary_requests.sql` in the Supabase SQL editor and confirm the table exists as `public.itinerary_requests`.

## Pre-Deploy Checks

```bash
npm run lint
npm run build
```

## Production Smoke Test

- Open `/sitemap.xml` and confirm the production domain appears.
- Submit one itinerary request.
- Confirm a Supabase row is created with `status = success`.
- Confirm `form_data` and `itinerary_result` are populated.
- Confirm the itinerary appears in the browser.
- Click the WhatsApp CTA and confirm the message contains the submitted trip summary.
- Download the PDF and confirm price, included services, and not included services appear.
- Check Vercel function logs for API errors.

## Lead Handling Process

Use Supabase Table Editor for the first deployment:

- Filter `itinerary_requests` by `created_at desc`.
- Review new rows with `status = success`.
- Open `form_data` for customer contact and preferences.
- Open `itinerary_result` for the generated offer.
- Contact the customer from WhatsApp or email.
- Track operational follow-up manually until a dedicated admin dashboard is added.

## Notes

The app includes a basic in-memory rate limit for `/api/generate-itinerary`. For heavier traffic, replace it with a shared store such as Upstash Redis because Vercel serverless instances do not share memory reliably.
