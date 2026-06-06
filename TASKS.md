# TourBay Tasks Checklist

## Phase 1: Foundation & Data Pipelines (Completed)
- [x] Initialized Next.js frontend with Tailwind and Hanken Grotesk / Inter / Geist fonts.
- [x] Created basic Supabase package schema and migrations.
- [x] Implemented Crawl4AI and Gemini 1.5 parsing scraper.
- [x] Verified database mutations and zero RLS issues.

## Phase 2: Live Ingestion & Filter Engine (Current)
- [x] Implement affiliate campaign link tracking parameter generator in crawler.
- [x] Setup Playwright headed fallback mechanism for anti-bot scraping (MakeMyTrip).
- [x] Hydrated Supabase instance to 21 active rows of Kashmir, Ladakh, and Manali package data.
- [x] Fix shadcn Slider / Select component typescript errors in `SidebarFilter.tsx`.
- [x] Wrap client search-param filter hook inside `<Suspense>` to avoid build hydration crashes.
- [x] Implement dynamic server-side Postgres client queries (`.lte()`, `.gte()`, `.contains()`) in `page.tsx`.
- [x] Ensure beautiful local mock fallback filtering continues to run if database connection fails.
- [x] Verify local production compilation with zero errors via `npm run build`.

## Phase 3: Deployment & Production Readiness (Upcoming)
- [ ] Automate scraper runs nightly using GitHub Actions.
- [ ] Implement responsive visual polishing for mobile views.
