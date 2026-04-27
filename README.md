# TripMate Georgia

AI-powered travel itinerary generator for Georgia.

TripMate Georgia helps tourists create personalized day-by-day travel plans based on their trip length, interests, budget, travel style, and starting city.

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
```

Never expose this key with `NEXT_PUBLIC_`.

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
- The API key is read from `process.env.OPENAI_API_KEY` on the server.
- The browser never receives the secret key.

## Future Improvements

- PDF export
- Save itinerary
- User accounts
- Stripe payments
- Supabase database
- Email itinerary to user
- Agency dashboard
- Multi-language support
