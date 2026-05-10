---
name: tour-parser
description: Specialized scraping logic with "Browser-use" fallback.
---
# Tour Parser Skill

## Scraping Strategy
1. **Primary:** Use `Crawl4AI` to extract Markdown. 
2. **Fallback:** If a 403 Forbidden or Cloudflare page is detected, switch to `browser-use` to simulate a real user session.
3. **Normalization:** Pass the Markdown to Gemini 1.5 Flash with the prompt: "Extract the final per-person price. If the price is per-couple, divide by 2. Format as JSON."

## Verification
Every scraper script must include a `test_parse()` function that prints the extracted JSON to the console for verification.