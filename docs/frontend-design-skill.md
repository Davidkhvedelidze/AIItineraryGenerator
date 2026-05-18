You are working on the TripMate Georgia project.

Task:
Update the existing frontend design instruction files with the extended frontend-design skill philosophy.

Files to update:

1. docs/frontend-design-skill.md
2. AGENTS.md if needed

Important:

- Do not modify application code.
- Do not modify pages/components.
- Do not modify Supabase, Sanity, OpenAI, or booking logic.
- Only update documentation/instruction files.
- Keep the instructions adapted to TripMate Georgia.
- Do not make the project generic.
- Keep the premium travel editorial direction.

In docs/frontend-design-skill.md, add a new section near the top:

# Core Frontend Design Philosophy

Add and adapt the following principles:

This design skill guides the creation of distinctive, production-grade frontend interfaces that avoid generic “AI slop” aesthetics. Every interface should be real working code with exceptional attention to aesthetic details, creative choices, usability, accessibility, and performance.

When building a component, page, landing page, tour detail page, blog page, booking flow, or application screen, first understand the context:

- What problem does this interface solve?
- Who uses it?
- What does the user need to feel?
- What action should the user take next?

Before coding, commit to a clear aesthetic direction.

For TripMate Georgia, the default direction should be:
Premium travel editorial + warm local hospitality + private tour booking trust.

The UI should feel:

- luxury/refined
- editorial/magazine-like
- organic/natural
- warm and human
- trustworthy
- travel-focused
- family-friendly
- suitable for Gulf/GCC travelers

Avoid generic choices:

- generic SaaS layout
- purple AI gradients
- plain white card grids
- predictable component patterns
- random glassmorphism
- template-like sections
- weak typography
- overused fonts without character
- cookie-cutter AI-generated UI

## Design Thinking Rules

Before coding, reason about:

### Purpose

What problem does this interface solve?

Examples:

- helping a traveler choose a private Georgia tour
- helping a family from the Gulf understand a route
- helping a user generate an itinerary
- helping a visitor trust direct booking
- helping a reader move from blog content to tour booking

### Tone

Pick a strong tone and execute it clearly.

For TripMate Georgia, prefer:

- premium travel magazine
- boutique private tour agency
- warm local expert
- family-friendly travel concierge
- elegant route-planning product

Do not drift into:

- generic AI startup
- cold dashboard
- over-animated tech demo
- cheap travel template

### Constraints

Respect:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Sanity CMS
- Supabase
- SEO requirements
- accessibility
- performance
- mobile-first layout

### Differentiation

Every major page should have one memorable idea.

For TripMate Georgia, the memorable idea is:
“Plan Georgia with AI, then make it real with local private tour support.”

Each page should reinforce:

- Georgia is beautiful
- the route is realistic
- private driver support is available
- the experience is comfortable for families
- Gulf/GCC travelers can travel with confidence
- direct booking feels trustworthy

## Frontend Aesthetic Guidelines

### Typography

Use typography with character and hierarchy.

Avoid default-looking typography such as Arial, Roboto, plain system UI, or overly generic Inter-style layouts unless the existing project already depends on them.

Use:

- strong editorial headings
- refined readable body text
- clear H1/H2/H3 structure
- generous line height
- premium article spacing
- distinctive font pairing when appropriate

Typography should make tour pages feel like premium travel editorial content, not a dashboard.

### Color & Theme

Commit to a cohesive travel-inspired theme.

Use:

- warm sand / beige backgrounds
- deep Georgian mountain green
- muted gold accents
- stone neutrals
- clean white cards
- dark readable text
- subtle warm borders

Avoid:

- purple AI gradients
- random blue SaaS palettes
- timid equal-weight colors
- cheap-looking bright colors

Use CSS variables or Tailwind tokens where possible.

### Motion

Use motion intentionally.

Prefer:

- one strong page-load reveal
- staggered card reveals
- subtle CTA hover interactions
- gallery reveal
- polished hero entrance

Use Framer Motion when appropriate.
Use GSAP only for isolated premium hero/gallery effects.

Do not:

- animate everything
- make SEO content client-only for animation
- add heavy scroll effects that hurt performance
- sacrifice accessibility

### Spatial Composition

Use layouts that feel designed.

Prefer:

- asymmetry
- editorial hero layouts
- overlapping image/content cards
- strong sticky booking sections
- generous negative space
- controlled visual density
- premium section rhythm
- mobile-first spacing

Avoid:

- predictable stacked cards everywhere
- boring grid-only layouts
- weak hero sections
- cluttered mobile screens

### Backgrounds & Visual Details

Create atmosphere and depth.

Use:

- soft image overlays
- subtle grain/noise texture
- warm travel-inspired backgrounds
- map-inspired line details
- mountain-shape accents
- refined shadows
- decorative borders
- layered cards

Avoid:

- generic blobs
- random gradients
- visual clutter
- effects that do not match Georgia travel context

## Implementation Expectations

When implementing UI:

- write real production-grade code
- keep components typed
- keep layouts responsive
- handle missing Sanity fields safely
- never render undefined/null
- keep SEO content server-rendered where possible
- use Client Components only for interaction
- use accessible HTML
- maintain strong visual hierarchy

## Complexity Rule

Match implementation complexity to the visual direction.

If the design is premium and refined:

- use restraint
- perfect spacing
- polished typography
- subtle motion
- high-quality imagery
- elegant cards

If a section needs strong visual impact:

- use bolder composition
- layered image treatments
- controlled animation
- memorable CTA design

Do not add complexity without purpose.

## TripMate Georgia Design Commitment

Every UI improvement should make the product feel more:

- trustworthy
- premium
- travel-specific
- useful for real travelers
- conversion-focused
- distinct from generic AI tools

The final result should feel intentionally designed for Georgia travel, not generated from a generic website template.

Also update AGENTS.md with a short note:

When doing frontend design tasks, follow docs/frontend-design-skill.md. Always choose a clear aesthetic direction before coding. For TripMate Georgia, use premium travel editorial + warm local hospitality. Avoid generic AI/SaaS aesthetics, purple gradients, boring card grids, and template-like UI.

After implementation:

- summarize which files were updated
- confirm no application logic was changed
