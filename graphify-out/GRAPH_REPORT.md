# Graph Report - .  (2026-07-06)

## Corpus Check
- Corpus is ~42,646 words - fits in a single context window. You may not need a graph.

## Summary
- 596 nodes · 1031 edges · 43 communities (35 shown, 8 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.64)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Blog & SEO Pages|Blog & SEO Pages]]
- [[_COMMUNITY_Itinerary Generation API|Itinerary Generation API]]
- [[_COMMUNITY_Frontend Dependencies (package.json)|Frontend Dependencies (package.json)]]
- [[_COMMUNITY_Itinerary Result Rendering & Sharing|Itinerary Result Rendering & Sharing]]
- [[_COMMUNITY_Route ErrorLoading Boundaries|Route Error/Loading Boundaries]]
- [[_COMMUNITY_Home Page Sections|Home Page Sections]]
- [[_COMMUNITY_AI Agent & Design Guidance Docs|AI Agent & Design Guidance Docs]]
- [[_COMMUNITY_Sanity Studio Dependencies|Sanity Studio Dependencies]]
- [[_COMMUNITY_Trip Planner Selectors & Options|Trip Planner Selectors & Options]]
- [[_COMMUNITY_Trip Planner Form Logic|Trip Planner Form Logic]]
- [[_COMMUNITY_TypeScript Config (App)|TypeScript Config (App)]]
- [[_COMMUNITY_Home Page UI Components|Home Page UI Components]]
- [[_COMMUNITY_Tour Detail Page|Tour Detail Page]]
- [[_COMMUNITY_TypeScript Config (Studio)|TypeScript Config (Studio)]]
- [[_COMMUNITY_Tour Gallery & Sanity Images|Tour Gallery & Sanity Images]]
- [[_COMMUNITY_Tour Itinerary & Reviews Types|Tour Itinerary & Reviews Types]]
- [[_COMMUNITY_Itinerary Day Card|Itinerary Day Card]]
- [[_COMMUNITY_Tour Card & Pricing List|Tour Card & Pricing List]]
- [[_COMMUNITY_Tour Pricing & Quick Facts|Tour Pricing & Quick Facts]]
- [[_COMMUNITY_Sanity Tour Data Import|Sanity Tour Data Import]]
- [[_COMMUNITY_Sanity Schema Config|Sanity Schema Config]]
- [[_COMMUNITY_Sanity Revalidation Webhook|Sanity Revalidation Webhook]]
- [[_COMMUNITY_Root Layout & Analytics|Root Layout & Analytics]]
- [[_COMMUNITY_Tour CTA & Hero|Tour CTA & Hero]]
- [[_COMMUNITY_Tour Booking Box & Form|Tour Booking Box & Form]]
- [[_COMMUNITY_Tour Booking Details|Tour Booking Details]]
- [[_COMMUNITY_Interest Selector|Interest Selector]]
- [[_COMMUNITY_Global Type Declarations|Global Type Declarations]]
- [[_COMMUNITY_Error Message Component|Error Message Component]]
- [[_COMMUNITY_Form Step Indicator|Form Step Indicator]]
- [[_COMMUNITY_Next.js Config & Security Headers|Next.js Config & Security Headers]]
- [[_COMMUNITY_Georgia Hero Illustration (SVG)|Georgia Hero Illustration (SVG)]]
- [[_COMMUNITY_Loading Itinerary Component|Loading Itinerary Component]]
- [[_COMMUNITY_Blog Posts Data|Blog Posts Data]]
- [[_COMMUNITY_ESLint Config (JSON)|ESLint Config (JSON)]]
- [[_COMMUNITY_Next.js Env Types|Next.js Env Types]]
- [[_COMMUNITY_Tailwind Config|Tailwind Config]]
- [[_COMMUNITY_App Logo Image|App Logo Image]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 20 edges
2. `compilerOptions` - 16 edges
3. `Header()` - 15 edges
4. `Footer()` - 13 edges
5. `TripFormData` - 13 edges
6. `compilerOptions` - 12 edges
7. `POST()` - 12 edges
8. `getSanityImageUrl()` - 12 edges
9. `normalizeExternalUrl()` - 11 edges
10. `cleanText()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Premium Travel Editorial Design Direction` --semantically_similar_to--> `Frontend Design Skill`  [INFERRED] [semantically similar]
  AGENTS.md → .claude/skills/frontend-design/SKILL.md
- `TourSectionNav()` --indirect_call--> `hasSanityImage()`  [INFERRED]
  src/app/tours/[slug]/page.tsx → src/lib/sanity/image.ts
- `3-Day Private Georgia Tour (Sample Sanity Tour Document)` --conceptually_related_to--> `Tour Detail Page Design Rules`  [INFERRED]
  docs/sample-tour-3-day-georgia.md → AGENTS.md
- `Supabase Setup (itinerary_requests table)` --shares_data_with--> `Vercel Deployment Checklist`  [EXTRACTED]
  README.md → docs/vercel-deployment.md
- `Vercel Deployment (README pointer)` --cites--> `Vercel Deployment Checklist`  [EXTRACTED]
  README.md → docs/vercel-deployment.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Frontend Design Guidance Chain (Generic Skill to Project-Specific Direction)** — claude_skills_frontend_design_skill_frontend_design, claude_skills_readme_frontend_design_plugin, agents_frontend_design_direction [INFERRED 0.85]
- **TripMate Georgia Project Documentation Set** — readme_tripmate_georgia, agents_tripmate_georgia_project, docs_vercel_deployment_checklist [INFERRED 0.85]
- **Sanity CMS Integration (Studio, Revalidation, Sample Content)** — sanity_readme_sanity_studio, sanity__sanity_runtime_index_sanity_studio_runtime, docs_vercel_deployment_sanity_revalidation, docs_sample_tour_3_day_georgia_tour [INFERRED 0.75]

## Communities (43 total, 8 thin omitted)

### Community 0 - "Blog & SEO Pages"
Cohesion: 0.06
Nodes (52): BlogPage(), metadata, BlogPostPage(), BlogPostPageProps, generateMetadata(), generateStaticParams(), absoluteUrl(), lastModified (+44 more)

### Community 1 - "Itinerary Generation API"
Cohesion: 0.08
Nodes (40): generationRateLimit, getApiErrorMessage(), getApiErrorResponse(), getApiErrorStatus(), getLoggableErrorDetails(), getRateLimitKey(), itineraryResultSchema, markItineraryRequestError() (+32 more)

### Community 2 - "Frontend Dependencies (package.json)"
Cohesion: 0.05
Nodes (40): dependencies, antd, class-variance-authority, clsx, framer-motion, groq, gsap, @hookform/resolvers (+32 more)

### Community 3 - "Itinerary Result Rendering & Sharing"
Cohesion: 0.09
Nodes (29): ErrorMessage, ActionHandlers, buildPrintableItineraryHtml(), buildWhatsAppUrl(), cleanList(), cleanText(), DetailBlock(), escapeHtml() (+21 more)

### Community 4 - "Route Error/Loading Boundaries"
Cohesion: 0.10
Nodes (11): metadata, ToursPage(), metadata, Footer(), Header(), navLinks, RouteError(), RouteErrorProps (+3 more)

### Community 5 - "Home Page Sections"
Cohesion: 0.08
Nodes (24): metadata, siteUrl, structuredData, CTASection(), ExampleItinerary(), itineraryDays, previewBenefits, container (+16 more)

### Community 6 - "AI Agent & Design Guidance Docs"
Cohesion: 0.07
Nodes (30): Accessibility Rules, Code Quality Rules, Premium Travel Editorial Design Direction, SEO Rules, TripMate Tech Stack (Next.js, TypeScript, Tailwind, Sanity, Supabase, Framer Motion, GSAP, Ant Design), Tour Detail Page Design Rules, TripMate Georgia AI Agent Instructions, Frontend Design Principles (hero as thesis, typography, structure, motion, complexity match) (+22 more)

### Community 7 - "Sanity Studio Dependencies"
Cohesion: 0.07
Nodes (29): dependencies, react, react-dom, sanity, @sanity/vision, styled-components, devDependencies, eslint (+21 more)

### Community 8 - "Trip Planner Selectors & Options"
Cohesion: 0.14
Nodes (18): BudgetSelector, BudgetSelectorComponent(), BudgetSelectorProps, TravelStyleSelector, TravelStyleSelectorComponent(), TravelStyleSelectorProps, TripPlannerFormProps, airportOptions (+10 more)

### Community 9 - "Trip Planner Form Logic"
Cohesion: 0.11
Nodes (17): calculateTripLength(), defaultArrivalDate, defaultDepartureDate, defaultTravelDates, fieldVariants, FormStep, formVariants, STEP_CONTENT (+9 more)

### Community 10 - "TypeScript Config (App)"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 11 - "Home Page UI Components"
Cohesion: 0.16
Nodes (13): defaultImage, ideaImages, kazbegiImage, PopularTripIdeas(), SeoCTA(), SeoCTAProps, ButtonProps, buttonVariants (+5 more)

### Community 12 - "Tour Detail Page"
Cohesion: 0.18
Nodes (14): buildTourJsonLd(), generateMetadata(), getAverageRating(), getBookingBoxTour(), getRatedReviews(), getVisibleItems(), ImportantNotes(), InclusionCard() (+6 more)

### Community 13 - "TypeScript Config (Studio)"
Cohesion: 0.13
Nodes (14): compilerOptions, allowJs, forceConsistentCasingInFileNames, incremental, isolatedModules, jsx, lib, module (+6 more)

### Community 14 - "Tour Gallery & Sanity Images"
Cohesion: 0.28
Nodes (10): TourGallery(), TourGalleryProps, getSafePortableTextHref(), TourOverview(), TourOverviewProps, builder, getSanityImageUrl(), hasSanityImage() (+2 more)

### Community 15 - "Tour Itinerary & Reviews Types"
Cohesion: 0.22
Nodes (8): TourItinerary(), TourItineraryProps, TourReviews(), TourReviewsProps, TourAgeGroup, TourFAQItem, TourItineraryItem, TourReview

### Community 16 - "Itinerary Day Card"
Cohesion: 0.27
Nodes (8): ItineraryDayCard, ItineraryDayCardProps, Card, CardContent, CardDescription, CardHeader, CardTitle, ItineraryDay

### Community 17 - "Tour Card & Pricing List"
Cohesion: 0.38
Nodes (8): getAverageRating(), TourCard(), TourCardProps, formatPrice(), getLowestTier(), getTourPriceSummary(), isPositivePrice(), TourListItem

### Community 18 - "Tour Pricing & Quick Facts"
Cohesion: 0.22
Nodes (8): formatTierPrice(), TourPricing(), TourPricingProps, QuickFact, TourQuickFacts(), TourQuickFactsProps, Tour, TourPricingTier

### Community 19 - "Sanity Tour Data Import"
Cohesion: 0.33
Nodes (6): client, getSlugValue(), importTours(), toSanityId(), TourImportData, toursData

### Community 20 - "Sanity Schema Config"
Cohesion: 0.36
Nodes (3): blogPost, schemaTypes, tour

### Community 21 - "Sanity Revalidation Webhook"
Cohesion: 0.43
Nodes (7): getSecretFromRequest(), getSlug(), POST(), revalidateBlogPaths(), revalidateTourPaths(), SanityWebhookPayload, secretsMatch()

### Community 22 - "Root Layout & Analytics"
Cohesion: 0.32
Nodes (4): metadata, siteUrl, GoogleAnalytics(), getSiteUrl()

### Community 23 - "Tour CTA & Hero"
Cohesion: 0.32
Nodes (6): TourBookingBox(), TourCTA(), TourCTAProps, TourHero(), TourHeroProps, normalizeExternalUrl()

### Community 24 - "Tour Booking Box & Form"
Cohesion: 0.33
Nodes (5): TourBookingBoxProps, TourBookingBoxTour, BookingFormValues, TourBookingForm(), TourBookingFormProps

### Community 25 - "Tour Booking Details"
Cohesion: 0.38
Nodes (4): ChipList(), TourBookingDetails(), TourBookingDetailsProps, visibleItems()

### Community 26 - "Interest Selector"
Cohesion: 0.40
Nodes (5): InterestSelector, InterestSelectorComponent(), InterestSelectorProps, interestOptions, TripInterest

### Community 27 - "Global Type Declarations"
Cohesion: 0.50
Nodes (3): *.css, *.sass, *.scss

### Community 29 - "Form Step Indicator"
Cohesion: 0.50
Nodes (3): FormStepIndicator, FormStepIndicatorProps, STEP_LABELS

### Community 31 - "Georgia Hero Illustration (SVG)"
Cohesion: 0.67
Nodes (3): Layered Hill/Wave Shapes, Sun/Circle Shape, Georgia Hero Illustration (SVG)

## Knowledge Gaps
- **226 isolated node(s):** `extends`, `*.css`, `*.scss`, `*.sass`, `securityHeaders` (+221 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@sanity/client` connect `Frontend Dependencies (package.json)` to `Blog & SEO Pages`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Why does `cn()` connect `Home Page UI Components` to `Route Error/Loading Boundaries`, `Trip Planner Selectors & Options`, `Trip Planner Form Logic`, `Itinerary Day Card`, `Interest Selector`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **What connects `extends`, `*.css`, `*.scss` to the rest of the system?**
  _232 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Blog & SEO Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.05541346973572037 - nodes in this community are weakly interconnected._
- **Should `Itinerary Generation API` be split into smaller, more focused modules?**
  _Cohesion score 0.07738095238095238 - nodes in this community are weakly interconnected._
- **Should `Frontend Dependencies (package.json)` be split into smaller, more focused modules?**
  _Cohesion score 0.04878048780487805 - nodes in this community are weakly interconnected._
- **Should `Itinerary Result Rendering & Sharing` be split into smaller, more focused modules?**
  _Cohesion score 0.09388335704125178 - nodes in this community are weakly interconnected._