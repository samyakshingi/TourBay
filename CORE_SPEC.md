# TourBay.in - Core Specification

## Project Identity
* **Motto:** "TourBay.in: One North, All Options. AI-Driven Clarity for Your Next Himalayan Escape."
* **Niche:** North India / Himalayan Tour Packages (POC Phase).
* **Objective:** Aggregate fragmented travel data into a standardized, side-by-side comparison engine.
* **Budget Strategy:** $0 POC using cloud free tiers and AI-driven automation.

## Architecture & Tech Stack
* **Database:** Supabase (PostgreSQL)
* **Frontend:** Next.js (React), Tailwind CSS, shadcn/ui (Hosted on Vercel)
* **Scraping Engine:** Python with Crawl4AI (Async, LLM-ready extraction)
* **Data Structuring:** Google Gemini 1.5 Flash API (Translating Markdown to JSON)
* **Automation:** GitHub Actions (Nightly Cron Jobs)

## Database Schema (PostgreSQL)
**Table: `packages`**
* `id` (UUID, Primary Key)
* `provider_name` (String) - *e.g., 'MakeMyTrip', 'Veena World'*
* `destination_region` (String) - *e.g., 'Kashmir', 'Spiti Valley'*
* `package_title` (String)
* `duration_days` (Int)
* `duration_nights` (Int)
* `price_inr` (Float) - *Final price per person, including all taxes.*
* `inclusions` (JSONB) - *Strict flags: `{ "flights": false, "hotels": true, "meals": true, "transfers": true, "sightseeing": true }`*
* `theme` (String) - *e.g., 'Adventure', 'Family', 'Honeymoon'*
* `package_url` (String) - *Direct link to the provider's booking page.*
* `image_url` (String) - *Thumbnail URL for the UI.*
* `last_scraped_at` (Timestamp)

## Target Platforms (Phase 1 POC)
1. MakeMyTrip
2. TravelTriangle
3. Yatra
4. Cleartrip
5. Goibibo
6. Veena World
7. Kesari Tours
8. Thomas Cook India
9. Thrillophilia
10. JustWravel