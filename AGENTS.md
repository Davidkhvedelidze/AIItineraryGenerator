# TripMate Georgia — AI Agent Instructions

## Project Context

TripMate Georgia is a travel-tech website for tourists visiting Georgia.

The product includes:

- AI Georgia itinerary generator
- SEO trip idea pages
- Sanity-powered blog
- Sanity-powered tours
- Direct booking / TripAdvisor booking flow
- Supabase lead and booking request storage

Main target users:

- First-time visitors to Georgia
- Families
- Gulf/GCC travelers from Saudi Arabia, Qatar, UAE, Kuwait, Bahrain, and Oman
- Travelers looking for private driver support, custom itineraries, cool mountain routes, wine tours, and family-friendly travel

## Tech Stack

Use:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Sanity CMS
- Supabase
- Framer Motion only where useful
- GSAP only for isolated premium visual effects
- Ant Design only for forms/modals/date pickers if already installed

Do not:

- Turn SEO pages fully client-side
- Break Supabase or OpenAI logic
- Add heavy dependencies without clear need
- Create generic AI-looking UI

## Frontend Design Direction

When designing or improving UI, follow a premium travel editorial style.

The design should feel:

- premium
- trustworthy
- warm
- human
- travel-focused
- family-friendly
- suitable for Gulf/GCC travelers
- clean but not boring

Avoid:

- generic SaaS look
- purple AI gradients
- random glassmorphism everywhere
- overly futuristic UI
- cluttered layouts
- weak typography
- placeholder-looking cards
- showing undefined/empty fields

## Visual Style

Use:

- large editorial hero sections
- strong travel imagery
- refined spacing
- rounded-2xl cards
- soft borders
- subtle shadows
- natural warm neutrals
- deep green / mountain tones
- gold or sand accent colors
- premium CTA buttons
- clean section hierarchy

Typography:

- Use a refined, readable body style
- Use stronger editorial headings
- Avoid making everything look like a dashboard
- Use clear H1/H2/H3 hierarchy

Composition:

- Prefer premium landing-page layouts
- Use asymmetric layouts where helpful
- Use sticky booking cards on tour detail pages
- Use section rhythm: hero → facts → story → itinerary → trust → CTA
- Keep mobile experience excellent

## Motion Guidelines

Use motion intentionally.

Framer Motion:

- subtle reveal animations
- card hover
- CTA micro-interactions
- section entrance transitions

GSAP:

- only for isolated hero/gallery effects
- do not make the entire page depend on GSAP
- avoid heavy scroll effects that hurt performance

Never sacrifice SEO or accessibility for animation.

## Tour Detail Page Design Rules

Tour detail pages should look like premium booking pages.

Required sections:

- Hero with image, title, excerpt, badges, price, CTAs
- Quick facts
- Gallery
- Overview
- Highlights
- Day-by-day itinerary
- Included / Not included
- Pricing tiers
- Pickup and booking details
- Reviews
- FAQ
- Sticky booking box
- Final CTA

Booking buttons:

- Request Direct Booking
- Book on TripAdvisor
- Generate Custom Itinerary where relevant

Important:

- Hide empty sections
- Never render undefined/null
- Use Sanity image fallbacks
- Keep detail pages server-rendered where possible

## SEO Rules

For SEO pages:

- Keep pages server-rendered where possible
- One H1 per page
- Use metadata from Sanity when available
- Use fallback metadata if missing
- Render crawlable content
- Add internal links
- Use FAQ where useful
- Add clear CTA to /#trip-planner, /tours, or WhatsApp/direct booking

Do not keyword-stuff.

## Accessibility Rules

- Use semantic HTML
- All buttons and links must be keyboard accessible
- Images must have meaningful alt text
- Maintain good contrast
- Do not rely only on color to communicate meaning
- Forms must have labels and clear errors

## Code Quality Rules

- Use TypeScript strictly
- Keep components small and reusable
- Prefer Server Components by default
- Use Client Components only for interaction
- Do not duplicate business logic
- Do not modify unrelated files
- Run npm run build after changes
